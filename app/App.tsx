import { FormBuilder } from './components/FormBuilder';
import { NavHeader } from './components/NavHeader';
import { useEffect } from 'react';

export default function App() {
  // Set document title
  useEffect(() => {
    document.title = 'Survey Builder for Teachers';
  }, []);
  
  // Load Maze Universal Snippet
  useEffect(() => {
    const apiKey = '69e0b013-3760-41d3-b9fa-da2d6ea757c4';
    
    // Get or set session timestamp
    let timestamp;
    try {
      timestamp = window.sessionStorage.getItem('maze-us');
    } catch (err) {
      // Handle storage access error
    }

    if (!timestamp) {
      timestamp = new Date().getTime().toString();
      try {
        window.sessionStorage.setItem('maze-us', timestamp);
      } catch (err) {
        // Handle storage access error
      }
    }

    // Create and append script element
    const script = document.createElement('script');
    script.src = `https://snippet.maze.co/maze-universal-loader.js?apiKey=${apiKey}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Set global API key
    window.mazeUniversalSnippetApiKey = apiKey;

    // Clean up function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header with logo, user info, and navigation tabs */}
      <NavHeader activeTab="fields" />
      
      {/* Main form builder content */}
      <FormBuilder />
    </div>
  );
}