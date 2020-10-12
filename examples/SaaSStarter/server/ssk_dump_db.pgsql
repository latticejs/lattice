--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3 (Debian 12.3-1.pgdg100+1)
-- Dumped by pg_dump version 12.3 (Debian 12.3-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_views;


ALTER SCHEMA hdb_views OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: check_violation(text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.check_violation(msg text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
  BEGIN
    RAISE check_violation USING message=msg;
  END;
$$;


ALTER FUNCTION hdb_catalog.check_violation(msg text) OWNER TO postgres;

--
-- Name: hdb_schema_update_event_notifier(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.hdb_schema_update_event_notifier() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    instance_id uuid;
    occurred_at timestamptz;
    invalidations json;
    curr_rec record;
  BEGIN
    instance_id = NEW.instance_id;
    occurred_at = NEW.occurred_at;
    invalidations = NEW.invalidations;
    PERFORM pg_notify('hasura_schema_update', json_build_object(
      'instance_id', instance_id,
      'occurred_at', occurred_at,
      'invalidations', invalidations
      )::text);
    RETURN curr_rec;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_schema_update_event_notifier() OWNER TO postgres;

--
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


ALTER FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) OWNER TO postgres;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_auth_id text NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    org_id uuid
);


ALTER TABLE public.user_role OWNER TO postgres;

--
-- Name: is_super_admin(public.user_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_super_admin(user_role_row public.user_role) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$

    SELECT EXISTS(SELECT * FROM role WHERE role.id = user_role_row.role_id AND role.name='super_admin')

$$;


ALTER FUNCTION public.is_super_admin(user_role_row public.user_role) OWNER TO postgres;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO postgres;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_triggers (
    name text NOT NULL,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    configuration json,
    comment text
);


ALTER TABLE hdb_catalog.event_triggers OWNER TO postgres;

--
-- Name: hdb_action; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action (
    action_name text NOT NULL,
    action_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_action OWNER TO postgres;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_action_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_permission (
    action_name text NOT NULL,
    role_name text NOT NULL,
    definition jsonb DEFAULT '{}'::jsonb NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_action_permission OWNER TO postgres;

--
-- Name: hdb_allowlist; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_allowlist (
    collection_name text
);


ALTER TABLE hdb_catalog.hdb_allowlist OWNER TO postgres;

--
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


ALTER TABLE hdb_catalog.hdb_check_constraint OWNER TO postgres;

--
-- Name: hdb_computed_field; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_computed_field (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    computed_field_name text NOT NULL,
    definition jsonb NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_computed_field OWNER TO postgres;

--
-- Name: hdb_computed_field_function; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_computed_field_function AS
 SELECT hdb_computed_field.table_schema,
    hdb_computed_field.table_name,
    hdb_computed_field.computed_field_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text) IS NULL) THEN (hdb_computed_field.definition ->> 'function'::text)
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text)
        END AS function_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text) IS NULL) THEN 'public'::text
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text)
        END AS function_schema
   FROM hdb_catalog.hdb_computed_field;


ALTER TABLE hdb_catalog.hdb_computed_field_function OWNER TO postgres;

--
-- Name: hdb_custom_types; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_custom_types (
    custom_types jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_custom_types OWNER TO postgres;

--
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete,
    json_agg(ac.attname) AS columns,
    json_agg(afc.attname) AS ref_columns
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


ALTER TABLE hdb_catalog.hdb_foreign_key_constraint OWNER TO postgres;

--
-- Name: hdb_function; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_function (
    function_schema text NOT NULL,
    function_name text NOT NULL,
    configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_function OWNER TO postgres;

--
-- Name: hdb_function_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_agg AS
 SELECT (p.proname)::text AS function_name,
    (pn.nspname)::text AS function_schema,
    pd.description,
        CASE
            WHEN (p.provariadic = (0)::oid) THEN false
            ELSE true
        END AS has_variadic,
        CASE
            WHEN ((p.provolatile)::text = ('i'::character(1))::text) THEN 'IMMUTABLE'::text
            WHEN ((p.provolatile)::text = ('s'::character(1))::text) THEN 'STABLE'::text
            WHEN ((p.provolatile)::text = ('v'::character(1))::text) THEN 'VOLATILE'::text
            ELSE NULL::text
        END AS function_type,
    pg_get_functiondef(p.oid) AS function_definition,
    (rtn.nspname)::text AS return_type_schema,
    (rt.typname)::text AS return_type_name,
    (rt.typtype)::text AS return_type_type,
    p.proretset AS returns_set,
    ( SELECT COALESCE(json_agg(json_build_object('schema', q.schema, 'name', q.name, 'type', q.type)), '[]'::json) AS "coalesce"
           FROM ( SELECT pt.typname AS name,
                    pns.nspname AS schema,
                    pt.typtype AS type,
                    pat.ordinality
                   FROM ((unnest(COALESCE(p.proallargtypes, (p.proargtypes)::oid[])) WITH ORDINALITY pat(oid, ordinality)
                     LEFT JOIN pg_type pt ON ((pt.oid = pat.oid)))
                     LEFT JOIN pg_namespace pns ON ((pt.typnamespace = pns.oid)))
                  ORDER BY pat.ordinality) q) AS input_arg_types,
    to_json(COALESCE(p.proargnames, ARRAY[]::text[])) AS input_arg_names,
    p.pronargdefaults AS default_args,
    (p.oid)::integer AS function_oid
   FROM ((((pg_proc p
     JOIN pg_namespace pn ON ((pn.oid = p.pronamespace)))
     JOIN pg_type rt ON ((rt.oid = p.prorettype)))
     JOIN pg_namespace rtn ON ((rtn.oid = rt.typnamespace)))
     LEFT JOIN pg_description pd ON ((p.oid = pd.objoid)))
  WHERE (((pn.nspname)::text !~~ 'pg_%'::text) AND ((pn.nspname)::text <> ALL (ARRAY['information_schema'::text, 'hdb_catalog'::text, 'hdb_views'::text])) AND (NOT (EXISTS ( SELECT 1
           FROM pg_aggregate
          WHERE ((pg_aggregate.aggfnoid)::oid = p.oid)))));


ALTER TABLE hdb_catalog.hdb_function_agg OWNER TO postgres;

--
-- Name: hdb_function_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_info_agg AS
 SELECT hdb_function_agg.function_name,
    hdb_function_agg.function_schema,
    row_to_json(( SELECT e.*::record AS e
           FROM ( SELECT hdb_function_agg.description,
                    hdb_function_agg.has_variadic,
                    hdb_function_agg.function_type,
                    hdb_function_agg.return_type_schema,
                    hdb_function_agg.return_type_name,
                    hdb_function_agg.return_type_type,
                    hdb_function_agg.returns_set,
                    hdb_function_agg.input_arg_types,
                    hdb_function_agg.input_arg_names,
                    hdb_function_agg.default_args,
                    (EXISTS ( SELECT 1
                           FROM information_schema.tables
                          WHERE (((tables.table_schema)::name = hdb_function_agg.return_type_schema) AND ((tables.table_name)::name = hdb_function_agg.return_type_name)))) AS returns_table) e)) AS function_info
   FROM hdb_catalog.hdb_function_agg;


ALTER TABLE hdb_catalog.hdb_function_info_agg OWNER TO postgres;

--
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


ALTER TABLE hdb_catalog.hdb_permission OWNER TO postgres;

--
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


ALTER TABLE hdb_catalog.hdb_permission_agg OWNER TO postgres;

--
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(constraint_column_usage.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN ( SELECT x.tblschema AS table_schema,
            x.tblname AS table_name,
            x.colname AS column_name,
            x.cstrname AS constraint_name
           FROM ( SELECT DISTINCT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_depend d,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (d.refclassid = ('pg_class'::regclass)::oid) AND (d.refobjid = r.oid) AND (d.refobjsubid = a.attnum) AND (d.classid = ('pg_constraint'::regclass)::oid) AND (d.objid = c.oid) AND (c.connamespace = nc.oid) AND (c.contype = 'c'::"char") AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])) AND (NOT a.attisdropped))
                UNION ALL
                 SELECT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (nc.oid = c.connamespace) AND (r.oid =
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confrelid
                            ELSE c.conrelid
                        END) AND (a.attnum = ANY (
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confkey
                            ELSE c.conkey
                        END)) AND (NOT a.attisdropped) AND (c.contype = ANY (ARRAY['p'::"char", 'u'::"char", 'f'::"char"])) AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])))) x(tblschema, tblname, colname, cstrname)) constraint_column_usage ON ((((tc.constraint_name)::text = (constraint_column_usage.constraint_name)::text) AND ((tc.table_schema)::text = (constraint_column_usage.table_schema)::text) AND ((tc.table_name)::text = (constraint_column_usage.table_name)::text))))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_primary_key OWNER TO postgres;

--
-- Name: hdb_query_collection; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_query_collection (
    collection_name text NOT NULL,
    collection_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_collection OWNER TO postgres;

--
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


ALTER TABLE hdb_catalog.hdb_relationship OWNER TO postgres;

--
-- Name: hdb_role; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_role AS
 SELECT DISTINCT q.role_name
   FROM ( SELECT hdb_permission.role_name
           FROM hdb_catalog.hdb_permission
        UNION ALL
         SELECT hdb_action_permission.role_name
           FROM hdb_catalog.hdb_action_permission) q;


ALTER TABLE hdb_catalog.hdb_role OWNER TO postgres;

--
-- Name: hdb_schema_update_event; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_update_event (
    instance_id uuid NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    invalidations json NOT NULL
);


ALTER TABLE hdb_catalog.hdb_schema_update_event OWNER TO postgres;

--
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema name NOT NULL,
    table_name name NOT NULL,
    configuration jsonb,
    is_system_defined boolean DEFAULT false,
    is_enum boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.hdb_table OWNER TO postgres;

--
-- Name: hdb_table_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_table_info_agg AS
 SELECT schema.nspname AS table_schema,
    "table".relname AS table_name,
    jsonb_build_object('oid', ("table".oid)::integer, 'columns', COALESCE(columns.info, '[]'::jsonb), 'primary_key', primary_key.info, 'unique_constraints', COALESCE(unique_constraints.info, '[]'::jsonb), 'foreign_keys', COALESCE(foreign_key_constraints.info, '[]'::jsonb), 'view_info',
        CASE "table".relkind
            WHEN 'v'::"char" THEN jsonb_build_object('is_updatable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 4) = 4), 'is_insertable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 8) = 8), 'is_deletable', ((pg_relation_is_updatable(("table".oid)::regclass, true) & 16) = 16))
            ELSE NULL::jsonb
        END, 'description', description.description) AS info
   FROM ((((((pg_class "table"
     JOIN pg_namespace schema ON ((schema.oid = "table".relnamespace)))
     LEFT JOIN pg_description description ON (((description.classoid = ('pg_class'::regclass)::oid) AND (description.objoid = "table".oid) AND (description.objsubid = 0))))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('name', "column".attname, 'position', "column".attnum, 'type', COALESCE(base_type.typname, type.typname), 'is_nullable', (NOT "column".attnotnull), 'description', col_description("table".oid, ("column".attnum)::integer))) AS info
           FROM ((pg_attribute "column"
             LEFT JOIN pg_type type ON ((type.oid = "column".atttypid)))
             LEFT JOIN pg_type base_type ON (((type.typtype = 'd'::"char") AND (base_type.oid = type.typbasetype))))
          WHERE (("column".attrelid = "table".oid) AND ("column".attnum > 0) AND (NOT "column".attisdropped))) columns ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_build_object('constraint', jsonb_build_object('name', class.relname, 'oid', (class.oid)::integer), 'columns', COALESCE(columns_1.info, '[]'::jsonb)) AS info
           FROM ((pg_index index
             JOIN pg_class class ON ((class.oid = index.indexrelid)))
             LEFT JOIN LATERAL ( SELECT jsonb_agg("column".attname) AS info
                   FROM pg_attribute "column"
                  WHERE (("column".attrelid = "table".oid) AND ("column".attnum = ANY ((index.indkey)::smallint[])))) columns_1 ON (true))
          WHERE ((index.indrelid = "table".oid) AND index.indisprimary)) primary_key ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('name', class.relname, 'oid', (class.oid)::integer)) AS info
           FROM (pg_index index
             JOIN pg_class class ON ((class.oid = index.indexrelid)))
          WHERE ((index.indrelid = "table".oid) AND index.indisunique AND (NOT index.indisprimary))) unique_constraints ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_agg(jsonb_build_object('constraint', jsonb_build_object('name', foreign_key.constraint_name, 'oid', foreign_key.constraint_oid), 'columns', foreign_key.columns, 'foreign_table', jsonb_build_object('schema', foreign_key.ref_table_table_schema, 'name', foreign_key.ref_table), 'foreign_columns', foreign_key.ref_columns)) AS info
           FROM hdb_catalog.hdb_foreign_key_constraint foreign_key
          WHERE ((foreign_key.table_schema = schema.nspname) AND (foreign_key.table_name = "table".relname))) foreign_key_constraints ON (true))
  WHERE ("table".relkind = ANY (ARRAY['r'::"char", 't'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"]));


ALTER TABLE hdb_catalog.hdb_table_info_agg OWNER TO postgres;

--
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_unique_constraint OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: migration_settings; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.migration_settings (
    setting text NOT NULL,
    value text NOT NULL
);


ALTER TABLE hdb_catalog.migration_settings OWNER TO postgres;

--
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


ALTER TABLE hdb_catalog.remote_schemas OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: postgres
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.remote_schemas_id_seq OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: postgres
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE hdb_catalog.schema_migrations OWNER TO postgres;

--
-- Name: group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."group" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."group" OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    auth_id text,
    email text,
    profile_photo text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: logged_in_user; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.logged_in_user AS
 SELECT "user".id,
    "user".name,
    "user".created_at,
    "user".updated_at,
    "user".auth_id,
    "user".email,
    "user".profile_photo
   FROM public."user";


ALTER TABLE public.logged_in_user OWNER TO postgres;

--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    filetype text NOT NULL,
    url text,
    is_delete boolean DEFAULT false NOT NULL
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    logo_url text,
    skin_color text
);


ALTER TABLE public.organization OWNER TO postgres;

--
-- Name: COLUMN organization.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization.code IS 'unique short code for org that can be part of a url';


--
-- Name: organization_member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_member (
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    role text NOT NULL
);


ALTER TABLE public.organization_member OWNER TO postgres;

--
-- Name: organization_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.organization_stats AS
SELECT
    NULL::uuid AS id,
    NULL::text AS name,
    NULL::bigint AS users_count,
    NULL::bigint AS groups_count;


ALTER TABLE public.organization_stats OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: user_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_group (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    users jsonb,
    org_id uuid
);


ALTER TABLE public.user_group OWNER TO postgres;

--
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- Data for Name: event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_log (id, schema_name, table_name, trigger_name, payload, delivered, error, tries, created_at, locked, next_retry_at, archived) FROM stdin;
\.


--
-- Data for Name: event_triggers; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_triggers (name, type, schema_name, table_name, configuration, comment) FROM stdin;
\.


--
-- Data for Name: hdb_action; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action (action_name, action_defn, comment, is_system_defined) FROM stdin;
changeEmail	{"kind": "synchronous", "type": "mutation", "handler": "http://172.31.27.146:4710/change-email", "headers": [], "arguments": [{"name": "newEmail", "type": "String", "description": null}, {"name": "name", "type": "String", "description": null}, {"name": "profilePictureUrl", "type": "String", "description": null}, {"name": "userId", "type": "uuid", "description": null}], "output_type": "changeEmailOutput!", "forward_client_headers": false}	\N	f
changePassword	{"kind": "synchronous", "type": "mutation", "handler": "http://172.31.27.146:4710/change-password", "headers": [], "arguments": [{"name": "credentials", "type": "Credentials!", "description": null}, {"name": "userId", "type": "uuid!", "description": null}], "output_type": "ChangePasswordOutput", "forward_client_headers": false}	\N	f
unlinkUserFromOrgAndDeleteUserAccount	{"kind": "synchronous", "type": "mutation", "handler": "http://172.31.27.146:4710/delete-user", "headers": [], "arguments": [{"name": "userId", "type": "String!", "description": null}, {"name": "orgId", "type": "String!", "description": null}], "output_type": "unlinkUserOutput", "forward_client_headers": false}	\N	f
signup	{"kind": "synchronous", "type": "mutation", "handler": "http://172.31.27.146:4710/signup", "headers": [], "arguments": [{"name": "name", "type": "String", "description": null}, {"name": "email", "type": "String", "description": null}, {"name": "orgId", "type": "uuid", "description": null}, {"name": "role", "type": "String", "description": null}], "output_type": "signupOutput", "forward_client_headers": false}	\N	f
\.


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_action_permission; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_permission (action_name, role_name, definition, comment) FROM stdin;
changeEmail	user	{}	\N
changePassword	user	{}	\N
signup	user	{}	\N
unlinkUserFromOrgAndDeleteUserAccount	user	{}	\N
\.


--
-- Data for Name: hdb_allowlist; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_allowlist (collection_name) FROM stdin;
\.


--
-- Data for Name: hdb_computed_field; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_computed_field (table_schema, table_name, computed_field_name, definition, comment) FROM stdin;
public	user_role	is_super_admin	{"function": {"name": "is_super_admin", "schema": "public"}, "table_argument": null}	Returns true if user has a role of super admin
\.


--
-- Data for Name: hdb_custom_types; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_custom_types (custom_types) FROM stdin;
{"enums": [], "objects": [{"name": "signupOutput", "fields": [{"name": "id", "type": "uuid!", "arguments": null, "description": null}], "description": null, "relationships": null}, {"name": "unlinkUserOutput", "fields": [{"name": "user_id", "type": "String!", "arguments": null, "description": null}], "description": null, "relationships": null}, {"name": "ChangePasswordOutput", "fields": [{"name": "user_id", "type": "uuid!", "arguments": null, "description": null}], "description": null, "relationships": null}, {"name": "changeEmailOutput", "fields": [{"name": "user_id", "type": "uuid!", "arguments": null, "description": null}], "description": null, "relationships": null}], "scalars": [], "input_objects": [{"name": "Credentials", "fields": [{"name": "oldPassword", "type": "String!", "description": null}, {"name": "newPassword", "type": "String!", "description": null}], "description": null}]}
\.


--
-- Data for Name: hdb_function; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_function (function_schema, function_name, configuration, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_permission; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_permission (table_schema, table_name, role_name, perm_type, perm_def, comment, is_system_defined) FROM stdin;
public	organization	user	select	{"filter": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}, "columns": ["code", "id", "logo_url", "name", "skin_color"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	user_group	user	insert	{"set": {}, "check": {}, "columns": ["group_id", "org_id", "users"], "backend_only": false}	\N	f
public	organization_member	user	update	{"filter": {}, "columns": ["created_at", "role", "updated_at"]}	\N	f
public	organization	user	update	{"set": {}, "filter": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}, "columns": ["code", "logo_url", "name", "skin_color"]}	\N	f
public	organization	user	delete	{"filter": {}}	\N	f
public	group	user	insert	{"set": {}, "check": {}, "columns": ["name"], "backend_only": false}	\N	f
public	group	user	update	{"set": {}, "filter": {}, "columns": ["name"]}	\N	f
public	user_group	user	update	{"set": {}, "filter": {}, "columns": ["users"]}	\N	f
public	group	user	delete	{"filter": {}}	\N	f
public	user_group	user	delete	{"filter": {}}	\N	f
public	organization_member	user	delete	{"filter": {}}	\N	f
public	user_group	user	select	{"filter": {}, "columns": ["created_at", "group_id", "id", "org_id", "updated_at", "users"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	group	user	select	{"filter": {}, "columns": ["id", "name"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	organization_stats	user	select	{"filter": {}, "columns": ["id", "name", "users_count", "groups_count"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	logged_in_user	user	select	{"filter": {"auth_id": {"_eq": "X-Hasura-User-Id"}}, "columns": ["auth_id", "created_at", "email", "id", "name", "profile_photo", "updated_at"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	media	user	insert	{"check": {"organization": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}}, "columns": ["filetype", "is_delete", "name", "organization_id", "url"], "backend_only": false}	\N	f
public	media	user	select	{"filter": {"organization": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}}, "columns": ["created_at", "filetype", "id", "is_delete", "name", "organization_id", "updated_at", "url"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	media	user	update	{"filter": {"organization": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}}, "columns": ["filetype", "is_delete", "name", "url"]}	\N	f
public	media	user	delete	{"filter": {"organization": {"organization_members": {"user": {"auth_id": {"_eq": "X-Hasura-User-Id"}}}}}}	\N	f
public	organization_member	user	insert	{"check": {}, "columns": ["created_at", "organization_id", "role", "updated_at", "user_id"], "backend_only": false}	\N	f
public	organization_member	user	select	{"filter": {}, "columns": ["created_at", "organization_id", "role", "updated_at", "user_id"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	user_role	user	select	{"filter": {}, "columns": ["created_at", "id", "org_id", "role_id", "updated_at", "user_auth_id"], "computed_fields": ["is_super_admin"], "allow_aggregations": false}	\N	f
public	user	user	insert	{"check": {}, "columns": ["auth_id", "created_at", "email", "id", "name", "profile_photo", "updated_at"], "backend_only": false}	\N	f
public	user	user	select	{"limit": 10, "filter": {}, "columns": ["created_at", "email", "id", "name", "profile_photo", "updated_at"], "computed_fields": [], "allow_aggregations": true}	\N	f
public	user	user	update	{"filter": {}, "columns": ["email", "name", "profile_photo"]}	\N	f
public	organization	user	insert	{"set": {}, "check": {}, "columns": ["id", "created_at", "updated_at", "name", "code", "logo_url", "skin_color"], "backend_only": false}	\N	f
public	role	user	select	{"filter": {}, "columns": ["id", "name", "created_at", "updated_at"], "computed_fields": [], "allow_aggregations": false}	\N	f
\.


--
-- Data for Name: hdb_query_collection; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_query_collection (collection_name, collection_defn, comment, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_relationship; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_relationship (table_schema, table_name, rel_name, rel_type, rel_def, comment, is_system_defined) FROM stdin;
hdb_catalog	hdb_table	detail	object	{"manual_configuration": {"remote_table": {"name": "tables", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	primary_key	object	{"manual_configuration": {"remote_table": {"name": "hdb_primary_key", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	columns	array	{"manual_configuration": {"remote_table": {"name": "columns", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	foreign_key_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_foreign_key_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	relationships	array	{"manual_configuration": {"remote_table": {"name": "hdb_relationship", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_permission_agg", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	computed_fields	array	{"manual_configuration": {"remote_table": {"name": "hdb_computed_field", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	check_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_check_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	unique_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_unique_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	event_triggers	events	array	{"manual_configuration": {"remote_table": {"name": "event_log", "schema": "hdb_catalog"}, "column_mapping": {"name": "trigger_name"}}}	\N	t
hdb_catalog	event_log	trigger	object	{"manual_configuration": {"remote_table": {"name": "event_triggers", "schema": "hdb_catalog"}, "column_mapping": {"trigger_name": "name"}}}	\N	t
hdb_catalog	event_log	logs	array	{"foreign_key_constraint_on": {"table": {"name": "event_invocation_logs", "schema": "hdb_catalog"}, "column": "event_id"}}	\N	t
hdb_catalog	event_invocation_logs	event	object	{"foreign_key_constraint_on": "event_id"}	\N	t
hdb_catalog	hdb_function_agg	return_table_info	object	{"manual_configuration": {"remote_table": {"name": "hdb_table", "schema": "hdb_catalog"}, "column_mapping": {"return_type_name": "table_name", "return_type_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_action	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_action_permission", "schema": "hdb_catalog"}, "column_mapping": {"action_name": "action_name"}}}	\N	t
hdb_catalog	hdb_role	action_permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_action_permission", "schema": "hdb_catalog"}, "column_mapping": {"role_name": "role_name"}}}	\N	t
hdb_catalog	hdb_role	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_permission_agg", "schema": "hdb_catalog"}, "column_mapping": {"role_name": "role_name"}}}	\N	t
public	logged_in_user	organization_member	array	{"manual_configuration": {"remote_table": {"name": "organization_member", "schema": "public"}, "column_mapping": {"id": "user_id"}}}	\N	f
public	media	organization	object	{"foreign_key_constraint_on": "organization_id"}	\N	f
public	organization	media	array	{"foreign_key_constraint_on": {"table": {"name": "media", "schema": "public"}, "column": "organization_id"}}	\N	f
public	organization	organization_members	array	{"foreign_key_constraint_on": {"table": {"name": "organization_member", "schema": "public"}, "column": "organization_id"}}	\N	f
public	organization_member	organization	object	{"foreign_key_constraint_on": "organization_id"}	\N	f
public	organization_member	user	object	{"foreign_key_constraint_on": "user_id"}	\N	f
public	user	organization_members	array	{"foreign_key_constraint_on": {"table": {"name": "organization_member", "schema": "public"}, "column": "user_id"}}	\N	f
public	user_group	group_details	object	{"manual_configuration": {"remote_table": {"name": "group", "schema": "public"}, "column_mapping": {"group_id": "id"}}}	\N	f
public	logged_in_user	user_roles	array	{"manual_configuration": {"remote_table": {"name": "user_role", "schema": "public"}, "column_mapping": {"auth_id": "user_auth_id"}}}	\N	f
public	user	user_roles	array	{"manual_configuration": {"remote_table": {"name": "user_role", "schema": "public"}, "column_mapping": {"auth_id": "user_auth_id"}}}	\N	f
public	group	group_users	array	{"manual_configuration": {"remote_table": {"name": "user_group", "schema": "public"}, "column_mapping": {"id": "group_id"}}}	\N	f
public	role	role_users	array	{"manual_configuration": {"remote_table": {"name": "user_role", "schema": "public"}, "column_mapping": {"id": "role_id"}}}	\N	f
public	user_group	org_details	object	{"manual_configuration": {"remote_table": {"name": "organization", "schema": "public"}, "column_mapping": {"org_id": "id"}}}	\N	f
public	organization	org_groups	array	{"manual_configuration": {"remote_table": {"name": "user_group", "schema": "public"}, "column_mapping": {"id": "org_id"}}}	\N	f
public	user_role	role_details	object	{"manual_configuration": {"remote_table": {"name": "role", "schema": "public"}, "column_mapping": {"role_id": "id"}}}	\N	f
public	user_role	user_details	object	{"manual_configuration": {"remote_table": {"name": "user", "schema": "public"}, "column_mapping": {"user_auth_id": "auth_id"}}}	\N	f
public	user_role	organization_details	object	{"manual_configuration": {"remote_table": {"name": "organization", "schema": "public"}, "column_mapping": {"org_id": "id"}}}	\N	f
public	organization	org_user_roles	array	{"manual_configuration": {"remote_table": {"name": "user_role", "schema": "public"}, "column_mapping": {"id": "org_id"}}}	\N	f
\.


--
-- Data for Name: hdb_schema_update_event; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_update_event (instance_id, occurred_at, invalidations) FROM stdin;
5f42da4e-89d9-4304-9faa-1b1010460d73	2020-09-24 11:58:41.862278+00	{"metadata":false,"remote_schemas":[]}
\.


--
-- Data for Name: hdb_table; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_table (table_schema, table_name, configuration, is_system_defined, is_enum) FROM stdin;
information_schema	tables	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	schemata	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	views	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
information_schema	columns	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_table	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_primary_key	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_foreign_key_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_relationship	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_permission_agg	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_computed_field	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_check_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_unique_constraint	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_triggers	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_log	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	event_invocation_logs	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_function	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_function_agg	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	remote_schemas	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_version	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_query_collection	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_allowlist	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_custom_types	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action_permission	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_action_log	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
hdb_catalog	hdb_role	{"custom_root_fields": {}, "custom_column_names": {}}	t	f
public	role	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	user_group	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	user_role	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	organization_stats	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	group	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	logged_in_user	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	media	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	organization	{"custom_root_fields": {}, "custom_column_names": {"code": "orgCode"}}	f	f
public	organization_member	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
public	user	{"custom_root_fields": {}, "custom_column_names": {}}	f	f
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state) FROM stdin;
347c134a-5268-44de-855a-18c38a2dc2f5	34	2020-08-21 11:03:30.087253+00	{}	{"telemetryNotificationShown": true}
\.


--
-- Data for Name: migration_settings; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.migration_settings (setting, value) FROM stdin;
migration_mode	true
\.


--
-- Data for Name: remote_schemas; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.remote_schemas (id, name, definition, comment) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.schema_migrations (version, dirty) FROM stdin;
1598249758579	f
\.

--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization (id, created_at, updated_at, name, code, logo_url, skin_color) FROM stdin;
2bcd8c4a-5c49-4143-90e0-6d45f7b2b1a2	2020-04-30 22:48:35.051516+00	2020-08-27 14:44:16.003912+00	lattice	lattice	https://sasskit-be.s3.amazonaws.com/8691bcc4-648f-4852-8482-9c6e2a3c6acf	#FA9619
903921e7-1b93-4c57-8661-bb9ff5979c98	2020-04-30 22:48:47.619036+00	2020-09-22 06:48:05.45961+00	Celestial	celestial	https://sasskit-be.s3.amazonaws.com/91ec3943-1e45-4e2a-8ed6-395a370dae36	#00527A
\.


--
-- Data for Name: organization_member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization_member (user_id, organization_id, created_at, updated_at, role) FROM stdin;
7a1e4c86-f013-47ba-90cf-f54491a5c496	2bcd8c4a-5c49-4143-90e0-6d45f7b2b1a2	2020-07-24 07:17:35.315824+00	2020-07-24 07:17:35.315824+00	Admin
7a1e4c86-f013-47ba-90cf-f54491a5c496	903921e7-1b93-4c57-8661-bb9ff5979c98	2020-08-24 11:29:05.604909+00	2020-08-24 11:29:05.604909+00	Admin
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name, created_at, updated_at) FROM stdin;
a29dbb99-7106-4d76-8be9-3abb6513edc5	super_admin	2020-08-24 04:16:27.859489+00	2020-08-24 04:16:27.859489+00
6af187a6-ef24-4e0e-b809-e7a0dbabc46b	member	2020-08-24 07:36:50.290551+00	2020-08-24 07:36:50.290551+00
0b1fe530-ab07-4729-96ca-c577ab2c64c0	user	2020-08-27 07:04:33.057329+00	2020-08-27 07:04:33.057329+00
c913edb8-3419-4444-8f6c-e56600fedf47	admin	2020-08-27 11:04:03.92537+00	2020-08-27 11:04:03.92537+00
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, created_at, updated_at, auth_id, email, profile_photo) FROM stdin;
7a1e4c86-f013-47ba-90cf-f54491a5c496	Super Admin	2020-07-24 07:17:35.306544+00	2020-08-28 11:42:41.224696+00	auth0|dummy-user-id	admin@admin.com	\N
\.


--
-- Data for Name: user_group; Type: TABLE DATA; Schema: public; Owner: postgres
--
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_role (id, user_auth_id, role_id, created_at, updated_at, org_id) FROM stdin;
584ca9d4-b9ce-4052-b2a8-670fa06e0397	auth0|dummy-user-id	a29dbb99-7106-4d76-8be9-3abb6513edc5	2020-08-24 04:28:15.606681+00	2020-08-27 13:37:18.895276+00	903921e7-1b93-4c57-8661-bb9ff5979c98
\.


--
-- Name: remote_schemas_id_seq; Type: SEQUENCE SET; Schema: hdb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('hdb_catalog.remote_schemas_id_seq', 1, false);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (name);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_permission hdb_action_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_permission
    ADD CONSTRAINT hdb_action_permission_pkey PRIMARY KEY (action_name, role_name);


--
-- Name: hdb_action hdb_action_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action
    ADD CONSTRAINT hdb_action_pkey PRIMARY KEY (action_name);


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_key UNIQUE (collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_pkey PRIMARY KEY (table_schema, table_name, computed_field_name);


--
-- Name: hdb_function hdb_function_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_function
    ADD CONSTRAINT hdb_function_pkey PRIMARY KEY (function_schema, function_name);


--
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- Name: hdb_query_collection hdb_query_collection_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_query_collection
    ADD CONSTRAINT hdb_query_collection_pkey PRIMARY KEY (collection_name);


--
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: migration_settings migration_settings_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.migration_settings
    ADD CONSTRAINT migration_settings_pkey PRIMARY KEY (setting);


--
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: group groups_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- Name: group groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: organization organization_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_code_key UNIQUE (code);


--
-- Name: organization_member organization_member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_pkey PRIMARY KEY (user_id, organization_id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: role roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: role roles_role_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT roles_role_key UNIQUE (name);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_created_at_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_created_at_idx ON hdb_catalog.event_log USING btree (created_at);


--
-- Name: event_log_delivered_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_delivered_idx ON hdb_catalog.event_log USING btree (delivered);


--
-- Name: event_log_locked_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_locked_idx ON hdb_catalog.event_log USING btree (locked);


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_schema_update_event_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_schema_update_event_one_row ON hdb_catalog.hdb_schema_update_event USING btree (((occurred_at IS NOT NULL)));


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: organization_stats _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.organization_stats AS
 SELECT o.id,
    o.name,
    count(DISTINCT om.user_id) AS users_count,
    count(DISTINCT ug.id) AS groups_count
   FROM ((public.organization o
     LEFT JOIN public.organization_member om ON ((om.organization_id = o.id)))
     LEFT JOIN public.user_group ug ON ((ug.org_id = o.id)))
  GROUP BY o.id;


--
-- Name: hdb_schema_update_event hdb_schema_update_event_notifier; Type: TRIGGER; Schema: hdb_catalog; Owner: postgres
--

CREATE TRIGGER hdb_schema_update_event_notifier AFTER INSERT OR UPDATE ON hdb_catalog.hdb_schema_update_event FOR EACH ROW EXECUTE FUNCTION hdb_catalog.hdb_schema_update_event_notifier();


--
-- Name: group set_public_groups_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_groups_updated_at BEFORE UPDATE ON public."group" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_groups_updated_at ON "group"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_groups_updated_at ON public."group" IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: media set_public_media_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_media_updated_at ON media; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_media_updated_at ON public.media IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: organization_member set_public_organization_member_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_organization_member_updated_at BEFORE UPDATE ON public.organization_member FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_organization_member_updated_at ON organization_member; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_organization_member_updated_at ON public.organization_member IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: organization set_public_organization_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_organization_updated_at BEFORE UPDATE ON public.organization FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_organization_updated_at ON organization; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_organization_updated_at ON public.organization IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: role set_public_roles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_roles_updated_at BEFORE UPDATE ON public.role FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_roles_updated_at ON role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_roles_updated_at ON public.role IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: user_group set_public_user_group_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_user_group_updated_at BEFORE UPDATE ON public.user_group FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_user_group_updated_at ON user_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_user_group_updated_at ON public.user_group IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: user_role set_public_user_role_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_user_role_updated_at BEFORE UPDATE ON public.user_role FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_user_role_updated_at ON user_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_user_role_updated_at ON public.user_role IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: user set_public_user_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_user_updated_at ON "user"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: event_triggers event_triggers_schema_name_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_schema_name_table_name_fkey FOREIGN KEY (schema_name, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_action_permission hdb_action_permission_action_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_permission
    ADD CONSTRAINT hdb_action_permission_action_name_fkey FOREIGN KEY (action_name) REFERENCES hdb_catalog.hdb_action(action_name) ON UPDATE CASCADE;


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_fkey FOREIGN KEY (collection_name) REFERENCES hdb_catalog.hdb_query_collection(collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_permission hdb_permission_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_relationship hdb_relationship_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: media media_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: organization_member organization_member_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: organization_member organization_member_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_member
    ADD CONSTRAINT organization_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--
