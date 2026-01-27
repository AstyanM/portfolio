import { visit } from 'unist-util-visit';

// Helper to extract text from a node recursively
function getNodeText(node) {
    if (node.type === 'text') {
        return node.value;
    }
    if (node.children && node.children.length > 0) {
        return node.children.map(getNodeText).join('');
    }
    return '';
}

export function rehypeFigureCaption() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName === 'p') {
                const text = getNodeText(node).trim();
                // Check if the paragraph starts with "Figure"
                // Matches: "Figure 1", "Figure 1:", "Figure 1 -", etc.
                if (/^(Figure|Vidéo|Video)\s+\d+/i.test(text) || text.startsWith('Figure') || text.startsWith('Vidéo') || text.startsWith('Video')) {
                    // console.log('Found caption:', text);
                    node.properties = node.properties || {};
                    node.properties.className = node.properties.className || [];
                    if (!node.properties.className.includes('figure-caption')) {
                        node.properties.className.push('figure-caption');
                    }
                }
            }
        });
    };
}
