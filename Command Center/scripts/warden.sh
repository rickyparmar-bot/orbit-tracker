#!/bin/bash

# Configuration
DISTRACTION_LIMIT=30
CHECK_INTERVAL=2
WHITELIST=("chromium" "google-chrome" "code" "kitty" "orbit-tracker" "vlc" "evince" "zathura")

distraction_time=0
dimmed=false

while true; do
    # Get active window class using hyprctl
    active_class=$(hyprctl activewindow -j | jq -r '.class')
    
    # Check if in whitelist
    is_whitelisted=false
    for app in "${WHITELIST[@]}"; do
        if [[ "$active_class" == *"$app"* ]]; then
            is_whitelisted=true
            break
        fi
    done

    if [ "$is_whitelisted" = false ] && [ "$active_class" != "null" ]; then
        ((distraction_time+=CHECK_INTERVAL))
        echo "Distraction detected: $active_class ($distraction_time s)"
        
        if [ $distraction_time -ge $DISTRACTION_LIMIT ]; then
            notify-send -u critical "WARDEN ALERT" "Non-study application active for >30s. Focus or be penalized."
            
            if [ "$dimmed" = false ]; then
                # Dim screen using brightnessctl (adjust as needed)
                # Save current brightness
                current_brightness=$(brightnessctl get)
                brightnessctl set 5%
                dimmed=true
            fi
        fi
    else
        if [ "$dimmed" = true ]; then
            brightnessctl set 100% # Restore or use saved value
            dimmed=false
        fi
        distraction_time=0
    fi

    sleep $CHECK_INTERVAL
done
