export const getSelectedSection = (checkedItems: string[]): string | undefined => { 
    const sectionItem = checkedItems.find(item => item.startsWith('section-'));
    if (sectionItem) {
      return sectionItem.replace('section-', '');
    }
    return undefined;
  };
  
  export const parseFilterValue = (itemId: string): { type: string, value: string } => {
    const [type, ...rest] = itemId.split('-');
    return {
      type,
      value: rest.join('-')
    };
  };