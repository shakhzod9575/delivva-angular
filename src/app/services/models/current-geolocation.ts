export interface CurrentGeolocation {
    trackNumber: string,
    path: [
        geo: {
            longitude: number,
            latitude: number
        }
    ]
}