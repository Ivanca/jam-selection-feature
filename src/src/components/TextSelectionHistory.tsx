import { useCallback, useState } from 'react';
import styled from 'styled-components';

import useTextSelection from '~/hooks/useTextSelection';
import type { SelectionWithTimeRange } from '~/types';

interface TextSelectionHistoryProps {
  totalDuration: number;
  startTime: number;
}

const TimeMark = styled.div.attrs<{ $left?: string; $right: string }>(
  (props) => ({
    $left: props.$left || '0%',
  })
)`
  border: 2px solid #bf4f74;
  left: ${(props) => props.$left};
  right: ${(props) => props.$right};
  position: absolute;
  min-height: 20px;
  background-color: #bf4f74;
`;

const TimeMarkContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
  min-height: 100px;
`;

const TextSelectionHistory = ({
  totalDuration,
  startTime,
}: TextSelectionHistoryProps) => {
  const [selectedTexts, setSelectedTexts] = useState<SelectionWithTimeRange[]>(
    []
  );
  const [lastSelectionChange, setLastSelectionChange] = useState<Date | null>(
    null
  );

  const onSelectionChangeCallback = useCallback(
    (text: string, anchorNode: Node, anchorOffset: number) => {
      setSelectedTexts((prev) => {
        const selTextsCopy = [...prev];
        const lastSelection = selTextsCopy[selTextsCopy.length - 1];
        if (lastSelection?.duration === -1) {
          selTextsCopy[selTextsCopy.length - 1] = {
            ...lastSelection,
            duration: Date.now() - lastSelection.date.getTime(),
          };
        }
        if (!text) {
          // emptied by user
          if (
            lastSelection &&
            Date.now() - lastSelection.date.getTime() < 2000
          ) {
            selTextsCopy.pop();
          }
          setLastSelectionChange(new Date());
          return selTextsCopy;
        }

        const newEntry = {
          text,
          date: new Date(),
          duration: -1,
          anchorNode,
          anchorOffset,
        };
        if (
          lastSelectionChange &&
          newEntry.date.getTime() - lastSelectionChange.getTime() < 3000 &&
          newEntry.anchorNode === lastSelection.anchorNode &&
          newEntry.anchorOffset === lastSelection.anchorOffset
        ) {
          newEntry.date = lastSelection.date;
          selTextsCopy.pop();
        }
        selTextsCopy.push(newEntry);
        setLastSelectionChange(new Date());
        return selTextsCopy;
      });
    },
    [setSelectedTexts, setLastSelectionChange, lastSelectionChange]
  );

  useTextSelection({
    onSelectionChange: onSelectionChangeCallback,
  });

  const timeMarks = selectedTexts.map(({ date, duration, text }) => {
    const left = (date.getTime() - startTime) / totalDuration;
    const right = duration === -1 ? 0 : 1 - left - duration / totalDuration;
    return (
      <TimeMark
        key={date.getTime()}
        $left={`${left * 100}%`}
        $right={`${right * 100}%`}
      >
        {text} - {date.toISOString()} - {duration}
      </TimeMark>
    );
  });

  return (
    <div>
      <p>
        Example by example - Example by example - Example by example - Example
        by example
      </p>
      <TimeMarkContainer>{timeMarks}</TimeMarkContainer>
    </div>
  );
};

export default TextSelectionHistory;
