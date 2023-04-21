import { useEffect, useState } from "react";

import Link from "next/link";
import { NextPage } from "next";
import PH_Locations from "@/lib/ph_locations.new.json";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Location {
	longitude: number;
	latitude: number;
	city?: string;
}

type Distance = {
	lat1: number;
	lon1: number;
	lat2: number;
	lon2: number;
};
type GeoCodeResult = {
	lat: number;
	lng: number;
	city: string;
};

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}

const getDistance = ({ lat1, lon1, lat2, lon2 }: Distance) => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1); // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
};

const reverseGeocode = async (location: Location) => {
	const closestLocation: GeoCodeResult[] = [];
	const closestDistance: number | null = null;

	for (const loc of PH_Locations) {
		const distance = getDistance({
			lat1: location.latitude,
			lon1: location.longitude,
			lat2: parseFloat(loc.lat) - 0.1224928,
			lon2: parseFloat(loc.lng) - 0.045524,
		});

		if (closestDistance === null || distance < closestDistance) {
			if (distance <= 25) {
				if (loc.capital === "admin" || loc.capital === "primary") {
					closestLocation.push({
						lat: parseFloat(loc.lat) - 0.0824928,
						lng: parseFloat(loc.lng) - 0.045524,
						city: loc.city,
					});
				}
			}
		}
	}

	return closestLocation;
};

const TestPage: NextPage = () => {
	const [location, setLocation] = useState<GeoCodeResult[] | null>(null);

	const getJobsFromLocation = async () => {
		if (location !== null) {
			const { data, error } = await supabase
				.from("public_jobs")
				.select("*")
				.in(
					"job_location",
					location.map((loc) => loc.city),
				);

			console.log(data);
		}
	};

	const getUserLocation = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.clear();

				// increase accuracy
				const location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};

				reverseGeocode(location).then((res) => {
					console.log(res);
					setLocation(res ? res : null);

					getJobsFromLocation();
				});
			});
		}
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	return (
		<>
			<div className="py-24">
				<Link href={"/h/feed/post?id=1"}>Go to page</Link>
			</div>
		</>
	);
};

export default TestPage;
