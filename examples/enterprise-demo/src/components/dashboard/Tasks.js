import React, { Component } from 'react';
import classnames from 'classnames';

// Material UI
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

// Lattice
import { Widget, List, ListItem } from '@latticejs/widgets';
const styles = theme => ({
  root: {
    'min-height': 300,
    [theme.breakpoints.down('sm')]: {
      'min-height': 300
    }
  },
  linearProgress: {
    height: 2,
    width: '100%'
  }
});

class Tasks extends Component {
  fetchMore = () => {
    const { tasks, fetchMore } = this.props;

    fetchMore({
      variables: { after: tasks ? tasks.pageInfo.endCursor : null },
      // concatenate old and new entries
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { edges: previousEdges, __typename } = previousResult.tasksConnection;
        const { totalCount, pageInfo, edges } = fetchMoreResult.tasksConnection;

        return {
          tasksConnection: {
            __typename,
            totalCount,
            pageInfo,
            edges: [...previousEdges, ...edges]
          }
        };
      }
    });
  };

  render() {
    const { tasks, loading, classes, classNames, title } = this.props;

    return (
      <Widget title={title} className={classnames([classNames, classes.root])} border="bottom">
        {loading ? (
          <CircularProgress className={classes.progress} size={50} />
        ) : (
          <List
            loadMore={this.fetchMore}
            list={tasks.edges.map(edge => edge.node)}
            rowCount={tasks.totalCount}
            rowHeight={68}
            height={300}
          >
            {({ item, isEmpty, key, style }) => {
              if (isEmpty) {
                return <h4>Empty list</h4>;
              }

              if (!item) {
                return (
                  <ListItem key={key} style={style}>
                    <LinearProgress className={classes.linearProgress} />
                  </ListItem>
                );
              }

              return (
                <ListItem key={key} style={style}>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            }}
          </List>
        )}
      </Widget>
    );
  }
}

export default withStyles(styles)(Tasks);
