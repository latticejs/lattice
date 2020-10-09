/* eslint-disable no-case-declarations */
import { useQuery } from '@apollo/react-hooks';
import React, { createContext, useEffect, useState } from 'react';
import gql from 'graphql-tag';

/**
 * query to get the recent uploaded media
 */
const GET_COUNT_QUERY = gql`
  {
    organization_stats {
      id
      name
      users_count
      groups_count
    }
  }
`;

export const Context = createContext({});

export const Provider = ({ children }) => {
  const [countList, setCountList] = useState(null);

  /**
   * Execute the query to get count
   */
  const countResponse = useQuery(GET_COUNT_QUERY);
  const countLoading = countResponse.loading;
  const countContextData = !countLoading ? countResponse.data : undefined;

  useEffect(() => {
    setCountList(countContextData);
  }, [countContextData]);

  const commonContext = { countList };

  /**
   * Pass the value in provider and return
   */
  return <Context.Provider value={commonContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;
