/** @format */

// LeafletMapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from 'leaflet';

const position = [51.0388, -2.2799];

const LeafletMapComponent = () => {
	const { data, activeTab } = useBooking();
	const [markers, setMarkers] = useState([]);
	const {
		PickupPostCode,
		PickupAddress,
		DestinationPostCode,
		DestinationAddress,
	} = data[activeTab];

	const newIcon = new Icon({
		iconUrl: '/map-pointer.png',
		iconSize: [25, 25],
	});

	// this is temperory code to get the lat and lng from the postal code
	// we need lat lng in the booking data context
	useEffect(() => {
		const getLatLngFromPostalCode = async (postalCode, apiKey) => {
			try {
				const response = await axios.get(
					'https://maps.googleapis.com/maps/api/geocode/json',
					{
						params: {
							address: postalCode,
							key: apiKey,
						},
					}
				);

				if (response.data.status === 'OK') {
					const { lat, lng } = response.data.results[0].geometry.location;
					return { lat, lng };
				} else {
					throw new Error('No results found');
				}
			} catch (error) {
				console.error('Error fetching the location:', error);
				throw error;
			}
		};
		const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;
		if (PickupPostCode)
			getLatLngFromPostalCode(PickupPostCode, apiKey).then((res) => {
				console.log(res);
				setMarkers((prev) => [
					...prev,
					{
						coords: [res.lat, res.lng],
						address: PickupAddress,
						postCode: PickupPostCode,
					},
				]);
			});
		if (DestinationPostCode)
			getLatLngFromPostalCode(DestinationPostCode, apiKey).then((res) =>
				setMarkers((prev) => [
					...prev,
					{
						coords: [res.lat, res.lng],
						address: DestinationAddress,
						postCode: DestinationPostCode,
					},
				])
			);
	}, [PickupPostCode, DestinationPostCode, PickupAddress, DestinationAddress]);
	console.log('markers', markers);

	return (
		<MapContainer
			center={position}
			zoom={8}
			style={{ height: '50%', width: '100%' }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution=''
			/>
			<Marker
				position={position}
				icon={newIcon}
			>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
			{markers.map((marker, idx) => (
				<Marker
					icon={newIcon}
					key={idx}
					position={marker.coords}
				>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable.
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default LeafletMapComponent;