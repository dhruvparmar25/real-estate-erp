"use client";
import { useCallback, useMemo } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { ENV } from "@/config/env";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_HEIGHT, DEFAULT_MAP_ZOOM, SINGLE_MARKER_ZOOM, } from "@/constants/map.constants";
import { cn } from "@/utils/cn";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
function isValidCoord(lat, lng) {
    return (Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180);
}
function Frame({ height, className, children, }) {
    return (<div className={cn("w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface)", className)} style={{ height }}>
      {children}
    </div>);
}
function MapMessage({ message }) {
    return (<div className="flex h-full w-full items-center justify-center px-4 text-center">
      <p className="text-small text-(--color-text-secondary)">{message}</p>
    </div>);
}
function LoadedMapView({ markers, height = DEFAULT_MAP_HEIGHT, zoom, className, }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "re-erp-google-maps",
        googleMapsApiKey: ENV.googleMapsApiKey,
        libraries: [],
    });
    const validMarkers = useMemo(() => markers.filter((m) => isValidCoord(m.lat, m.lng)), [markers]);
    const center = useMemo(() => {
        if (validMarkers.length === 1) {
            return { lat: validMarkers[0].lat, lng: validMarkers[0].lng };
        }
        return DEFAULT_MAP_CENTER;
    }, [validMarkers]);
    const mapZoom = zoom ?? (validMarkers.length === 1 ? SINGLE_MARKER_ZOOM : DEFAULT_MAP_ZOOM);
    const onLoad = useCallback((map) => {
        if (validMarkers.length < 2) return;
        try {
            const bounds = new google.maps.LatLngBounds();
            for (const marker of validMarkers) {
                bounds.extend({ lat: marker.lat, lng: marker.lng });
            }
            map.fitBounds(bounds, 48);
        } catch {}
    }, [validMarkers]);
    if (loadError) {
        return (<Frame height={height} className={className}>
        <MapMessage message="Map failed to load. Check the Google Maps API key."/>
      </Frame>);
    }
    if (!isLoaded) {
        return (<Frame height={height} className={className}>
        <LoadingSkeleton className="h-full w-full rounded-none"/>
      </Frame>);
    }
    if (validMarkers.length === 0) {
        return (<Frame height={height} className={className}>
        <MapMessage message="No plot location to show."/>
      </Frame>);
    }
    return (<Frame height={height} className={className}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={mapZoom} onLoad={onLoad} options={{
            disableDefaultUI: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            clickableIcons: false,
        }}>
        {validMarkers.map((marker, index) => (<MarkerF key={marker.id ?? `${marker.lat}-${marker.lng}-${index}`} position={{ lat: marker.lat, lng: marker.lng }} title={marker.label}/>))}
      </GoogleMap>
    </Frame>);
}
export function MapView(props) {
    const height = props.height ?? DEFAULT_MAP_HEIGHT;
    if (!ENV.googleMapsApiKey) {
        return (<Frame height={height} className={props.className}>
        <MapMessage message="Map not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env."/>
      </Frame>);
    }
    return <LoadedMapView {...props}/>;
}
