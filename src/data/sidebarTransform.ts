import { FilterResponse } from './interface';
import { SidebarItem } from './types';

export const parseFilterValue = (id: string) => {
  const [type, value] = id.split('-');
  return { type, value };
};

export const createCheckboxItem = (
  id: string,
  title: string,
  orderIndex: number,
  type: string
): SidebarItem => ({
  id: `${type}-${orderIndex}`,
  title,
  type: 'list',
  orderIndex
});

export const updateSidebarChildren = (
  filterResponse: FilterResponse,
  currentChildren: SidebarItem[]
) => {
  const newChildren: SidebarItem[] = [];

  // Add section items
  filterResponse.sections?.forEach(section => {
    newChildren.push(createCheckboxItem(
      `section-${section.orderIndex}`,
      section.name,
      section.orderIndex,
      'section'
    ));
  });

  // Add stage items
  filterResponse.stages?.forEach(stage => {
    newChildren.push(createCheckboxItem(
      `stage-${stage.orderIndex}`,
      stage.name,
      stage.orderIndex,
      'stage'
    ));
  });

  // Add location items
  filterResponse.locations?.forEach(location => {
    newChildren.push(createCheckboxItem(
      `location-${location.orderIndex}`,
      location.name,
      location.orderIndex,
      'location'
    ));
  });

  // Add area items
  filterResponse.areas?.forEach(area => {
    newChildren.push(createCheckboxItem(
      `area-${area.orderIndex}`,
      area.name,
      area.orderIndex,
      'area'
    ));
  });

  // Add topic items
  filterResponse.topics?.forEach(topic => {
    newChildren.push(createCheckboxItem(
      `topic-${topic.orderIndex}`,
      topic.name,
      topic.orderIndex,
      'topic'
    ));
  });

  return newChildren;
}; 