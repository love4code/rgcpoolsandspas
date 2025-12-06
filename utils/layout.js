// Helper to render pages with layout
const renderWithLayout = (res, view, data = {}) => {
  // Extract title if provided
  const title = data.title || '';
  const settings = data.settings || {};
  
  // Merge layout data
  const layoutData = {
    ...data,
    title,
    settings,
    body: (() => {
      // This will be populated by the view
      return '';
    })()
  };
  
  // Render the view with layout
  res.render(view, layoutData);
};

module.exports = { renderWithLayout };

