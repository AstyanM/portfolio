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

// Video file extensions to detect
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];

function isVideoUrl(url) {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return VIDEO_EXTENSIONS.some(ext => lowerUrl.endsWith(ext));
}

export function rehypeVideo() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            // Look for links (<a>) that point to video files
            if (node.tagName === 'a' && node.properties?.href) {
                const href = node.properties.href;

                if (isVideoUrl(href)) {
                    // Get the link text for the video caption/alt
                    const caption = getNodeText(node).trim();

                    // Transform the <a> into a <video> element
                    node.tagName = 'video';
                    node.properties = {
                        src: href,
                        controls: true,
                        preload: 'metadata',
                        className: ['video-player'],
                        title: caption || undefined,
                    };
                    // Remove children (the link text)
                    node.children = [
                        {
                            type: 'text',
                            value: `Votre navigateur ne supporte pas la lecture de vidéos.`
                        }
                    ];
                }
            }
        });
    };
}
