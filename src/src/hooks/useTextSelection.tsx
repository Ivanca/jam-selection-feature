import { useEffect } from 'react';

import type { TextSelection } from '~/types';
import { copyPropsFromObject, simpleCompareObjEquality } from '~/utils/utils';

function copyCurrentSelectionObj(): TextSelection | null {
  const sel = window.getSelection();
  if (sel === null) {
    return null;
  }
  return copyPropsFromObject(sel, [
    'anchorNode',
    'anchorOffset',
    'focusNode',
    'focusOffset',
    'isCollapsed',
    'rangeCount',
    'type',
  ]) as TextSelection;
}

const getCleanSelectedText = () => {
  let text = window.getSelection()?.toString() || '';
  text = text.replace(/ +/g, ' ').replace(/\t+/g, '\t').replace(/\n+/g, '\n');
  if (text.length > 256) {
    text = `${text.slice(0, 256)}...`;
  }
  if ((text.match(/\n/g)?.length || 0) > 5) {
    text = `${text.split('\n').slice(0, 5).join('\n')}...`;
  }
  return text;
};

const useTextSelection = ({
  onSelectionChange,
}: {
  onSelectionChange: (
    text: string,
    anchorNode: Node,
    anchorOffset: number
  ) => void;
}) => {
  useEffect(() => {
    let debounce = 0;
    let selection = copyCurrentSelectionObj();
    let text = getCleanSelectedText();
    const handleSelectionChange = () => {
      const newSelection = copyCurrentSelectionObj();
      if (!simpleCompareObjEquality(newSelection, selection)) {
        clearTimeout(debounce);
        debounce = window.setTimeout(() => {
          selection = newSelection;
          text = getCleanSelectedText();
          onSelectionChange(
            text,
            selection?.anchorNode || document.body,
            selection?.anchorOffset || 0
          );
        }, 300);
      } else {
        // eslint-disable-next-line no-console
        console.log('same selection', newSelection);
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [onSelectionChange]);
};

export default useTextSelection;
