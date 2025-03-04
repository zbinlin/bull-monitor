import React, { memo, useCallback } from 'react';
import type { GetQueuesQuery } from '@/typings/gql';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import JobsCount from './JobsCount';
import PauseIcon from '@mui/icons-material/Pause';
import BlockIcon from '@mui/icons-material/Block';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { useJobsCountArray, useQueueWorkspaceLabel } from './hooks';

const useStyles = makeStyles((theme) => ({
  listItem: {
    position: 'relative',
    paddingRight: theme.spacing(1),
    '& .MuiListItemIcon-root': {
      minWidth: 32,
    },
  },
}));

type TProps = {
  queue: NonNullable<GetQueuesQuery['queues']>[0];
  isSelected: boolean;

  onSelect: (queue: string, label: string) => void;
};
const DrawerQueue = (props: TProps) => {
  const cls = useStyles();
  const workspaceLabel = useQueueWorkspaceLabel(props.queue);
  const { id, isPaused, readonly } = props.queue;
  const onSelect = useCallback(() => {
    props.onSelect(id, workspaceLabel);
  }, [id, workspaceLabel]);
  const countArray = useJobsCountArray(props.queue.jobsCounts);
  return (
    <ListItem
      onClick={onSelect}
      selected={props.isSelected}
      className={cls.listItem}
      dense
      button
    >
      {(readonly || isPaused) && (
        <ListItemIcon>
          <ListItemIcon title={isPaused ? 'Paused' : 'Readonly'}>
            {isPaused ? <PauseIcon /> : <BlockIcon />}
          </ListItemIcon>
        </ListItemIcon>
      )}
      <ListItemText
        disableTypography
        primary={
          <Typography
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {props.queue.name}
          </Typography>
        }
        secondary={<JobsCount count={countArray} />}
      />
    </ListItem>
  );
};

export default memo(DrawerQueue);
