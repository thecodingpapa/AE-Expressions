#!/bin/bash

# Make sure we're operating in the directory where this script is located
cd "$(dirname "$0")"

echo "=========================================="
echo "  Rainvic AE Tools - MacOS Installer"
echo "=========================================="
echo ""

PLUGIN_NAME="RainvicAETools.jsx"

if [ ! -f "$PLUGIN_NAME" ]; then
    echo "❌ Error: Could not find $PLUGIN_NAME."
    echo "Please ensure this installer and $PLUGIN_NAME are in the exact same folder."
    echo ""
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

# Find all Adobe After Effects installations in the Applications folder
ae_dirs=( /Applications/Adobe\ After\ Effects* )

valid_dirs=()
for dir in "${ae_dirs[@]}"; do
    if [ -d "$dir" ]; then
        valid_dirs+=("$dir")
    fi
done

if [ ${#valid_dirs[@]} -eq 0 ]; then
    echo "❌ No Adobe After Effects installations found in /Applications."
    echo ""
    read -n 1 -s -r -p "Press any key to exit..."
    exit 1
fi

selected_dir=""

if [ ${#valid_dirs[@]} -eq 1 ]; then
    selected_dir="${valid_dirs[0]}"
    echo "✅ Found $selected_dir"
else
    echo "We found multiple After Effects installations on your Mac:"
    PS3="Please enter the number for the version you want to install to: "
    select dir in "${valid_dirs[@]}"; do
        if [ -n "$dir" ]; then
            selected_dir="$dir"
            break
        else
            echo "Invalid selection. Please try again."
        fi
    done
fi

target_dir="$selected_dir/Scripts/ScriptUI Panels"

# Check if target directory exists - some people might have deleted it
if [ ! -d "$target_dir" ]; then
    echo "Directory $target_dir does not exist. Creating it..."
    sudo mkdir -p "$target_dir"
fi

echo ""
echo "Installing to: $target_dir"
echo "⚠️  NOTE: Mac OS requires permission to copy files into Applications. You may be prompted for your Administrator password."
echo ""

sudo cp "$PLUGIN_NAME" "$target_dir/"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! The plugin has been installed."
    echo "Please restart After Effects, and click 'Window' -> 'RainvicAETools.jsx'."
else
    echo ""
    echo "❌ Installation failed. Please check your admin privileges and try again."
fi

echo ""
read -n 1 -s -r -p "Press any key to exit..."
