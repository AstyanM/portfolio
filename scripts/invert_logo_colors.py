"""
Script to invert black and white pixels in logo images for dark mode versions.
Black pixels become white, white pixels become black, other colors remain unchanged.
"""
from PIL import Image
import sys
import os

def invert_black_white(image_path, output_path):
    """
    Inverts black and white pixels in an image.
    Black (0,0,0) becomes white (255,255,255) and vice versa.
    Other colors remain unchanged.
    
    Args:
        image_path: Path to the input image
        output_path: Path to save the output image
    """
    # Open the image
    img = Image.open(image_path)
    
    # Convert to RGBA if not already (to handle transparency)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get pixel data
    pixels = img.load()
    width, height = img.size
    
    # Process each pixel
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Check if pixel is black (or very close to black)
            if r < 10 and g < 10 and b < 10:
                # Convert black to white
                pixels[x, y] = (255, 255, 255, a)
            # Check if pixel is white (or very close to white)
            elif r > 245 and g > 245 and b > 245:
                # Convert white to black
                pixels[x, y] = (0, 0, 0, a)
            # Otherwise, leave the pixel unchanged
    
    # Save the modified image
    img.save(output_path)
    print(f"✓ Created: {output_path}")

def main():
    # Base directory for logos
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schools_dir = os.path.join(base_dir, 'public', 'assets', 'schools')
    
    # Define the conversions needed
    conversions = [
        ('kleber_light.png', 'kleber_dark.png'),
        ('trento_light.png', 'trento_dark.png'),
    ]
    
    print("Generating dark mode logo versions...\n")
    
    for input_file, output_file in conversions:
        input_path = os.path.join(schools_dir, input_file)
        output_path = os.path.join(schools_dir, output_file)
        
        if not os.path.exists(input_path):
            print(f"✗ Error: {input_file} not found at {input_path}")
            continue
        
        try:
            invert_black_white(input_path, output_path)
        except Exception as e:
            print(f"✗ Error processing {input_file}: {str(e)}")
    
    print("\n✓ Dark mode logo generation complete!")

if __name__ == "__main__":
    main()
