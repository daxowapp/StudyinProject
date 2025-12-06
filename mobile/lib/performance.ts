import { memo, useCallback } from 'react';
import { FlatList, FlatListProps } from 'react-native';

// Optimized FlatList for large lists
export function OptimizedList<T>({
    data,
    renderItem,
    keyExtractor,
    ...props
}: FlatListProps<T>) {
    const memoizedRenderItem = useCallback(renderItem as any, []);

    return (
        <FlatList
      data= { data }
    renderItem = { memoizedRenderItem }
    keyExtractor = { keyExtractor }
    removeClippedSubviews = { true}
    maxToRenderPerBatch = { 10}
    windowSize = { 5}
    initialNumToRender = { 10}
    getItemLayout = { props.getItemLayout }
    {...props }
    />
  );
}

// Performance tips for the app
export const PERFORMANCE_TIPS = {
    // Use React.memo for list items
    memoizeListItems: 'Wrap list item components with React.memo()',

    // Avoid inline functions in render
    avoidInlineFunctions: 'Define callbacks outside render or use useCallback',

    // Use getItemLayout for fixed-height items
    useGetItemLayout: 'Provide getItemLayout for FlatLists with fixed item heights',

    // Lazy load screens
    lazyLoadScreens: 'Use React.lazy() for screens not immediately visible',

    // Optimize images
    optimizeImages: 'Use resizeMode="cover" and specify dimensions',

    // Avoid anonymous functions in JSX
    useCallbacks: 'Use useCallback for event handlers passed as props',
};

// Constants for list optimization
export const LIST_OPTIMIZATION = {
    INITIAL_NUM_TO_RENDER: 10,
    MAX_TO_RENDER_PER_BATCH: 10,
    WINDOW_SIZE: 5,
    REMOVE_CLIPPED_SUBVIEWS: true,
};
