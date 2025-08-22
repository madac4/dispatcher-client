export {}

namespace google.maps {
	interface DirectionsViaWaypoint {
		location: google.maps.LatLng
		step_index: number
		step_interpolation: number
	}
	interface DirectionsLeg {
		via_waypoint?: google.maps.DirectionsViaWaypoint[]
	}
}
