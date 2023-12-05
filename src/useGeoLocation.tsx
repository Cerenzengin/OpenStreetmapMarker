import React, { useState, useEffect } from "react";

interface Coordinates {
    lat: string;
    lng: string;
}

interface LocationState {
    loaded: boolean;
    coordinates: Coordinates;
    error?: {
        code: number;
        message: string;
        PERMISSION_DENIED?: number;
        POSITION_UNAVAILABLE?: number;
        TIMEOUT?: number;
    };
}

const useGeoLocation = () => {
    const [location, setLocation] = useState<LocationState>({
        loaded: false,
        coordinates: { lat: "", lng: "" },
    });

    const onSuccess = (position: GeolocationPosition) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: position.coords.latitude.toString(),
                lng: position.coords.longitude.toString(),
            },
        });
    };
    
    const onError = (error: { code: number; message: string }) => {
        setLocation({
            loaded: true,
            coordinates: { lat: "", lng: "" },
            error: {
                code: error.code,
                message: error.message,
                PERMISSION_DENIED: error.code === 1 ? 1 : undefined,
                POSITION_UNAVAILABLE: error.code === 2 ? 2 : undefined,
                TIMEOUT: error.code === 3 ? 3 : undefined,
            },
        });
    };
    
    useEffect(() => {
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation not supported",
            });
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return location;
};

export default useGeoLocation;
