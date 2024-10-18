/** @format */

// import { useEffect, useState } from 'react';
// import { TextField } from '@mui/material';
// import {
// 	// loadGoogleMapsScript,
// 	getAutocompleteService,
// 	getPlacesService,
// } from '../utils/googleMap';

// import { getPoi } from '../utils/apiReq';

// const SP8_4QA_COORDS = { lat: 51.0388, lng: -2.2799 };
// const RADIUS = 10000;

// function PlaceAutocomplete({
// 	placeholder,
// 	value,
// 	onChange,
// 	onPushChange,
// 	inputRef,
// 	handleChangeRef,
// 	handleClickRef,
// }) {
// 	const [suggestions, setSuggestions] = useState([]);
// 	const [showOption, setShowOption] = useState(false);
// 	const [highlightedIndex, setHighlightedIndex] = useState(-1);
// 	const [blur, setBlur] = useState(false);

// 	const handleInputChange = async (event) => {
// 		onChange(event);
// 		const input = event.target.value;
// 		let tempSuggestions = [];
// 		setHighlightedIndex(-1);
// 		if (input.length >= 4) {
// 			const res = await getPoi(input);
// 			tempSuggestions = res.map((poi) => ({
// 				label: `${poi.address}, ${poi.postcode}`,
// 				id: poi.id,
// 				name: poi.name,
// 				address: poi.address,
// 				postcode: poi.postcode,
// 				longitude: poi.longitude,
// 				latitude: poi.latitude,
// 			}));
// 			setSuggestions(tempSuggestions);
// 			const autocompleteService = getAutocompleteService();
// 			autocompleteService.getPlacePredictions(
// 				{
// 					input,
// 					location: new window.google.maps.LatLng(
// 						SP8_4QA_COORDS.lat,
// 						SP8_4QA_COORDS.lng
// 					),
// 					radius: RADIUS,
// 				},
// 				(predictions, status) => {
// 					if (status === window.google.maps.places.PlacesServiceStatus.OK) {
// 						Promise.all(
// 							predictions.map((prediction) => getPlaceDetails(prediction))
// 						).then((detailedPredictions) => {
// 							const filteredPredictions = detailedPredictions.filter(
// 								(prediction) => prediction && prediction.postcode
// 							);
// 							tempSuggestions = [...tempSuggestions, ...filteredPredictions];
// 							setSuggestions(tempSuggestions);
// 						});
// 					} else {
// 						setSuggestions([]);
// 					}
// 				}
// 			);
// 		} else {
// 			setSuggestions([]);
// 		}
// 	};

// 	function getPlaceDetails(prediction) {
// 		return new Promise((resolve) => {
// 			const placesService = getPlacesService();
// 			const request = {
// 				placeId: prediction.place_id,
// 				fields: ['address_component', 'geometry.location'],
// 			};
// 			placesService.getDetails(request, (place, status) => {
// 				if (status === window.google.maps.places.PlacesServiceStatus.OK) {
// 					const postalCode = place.address_components.find((component) =>
// 						component.types.includes('postal_code')
// 					)?.long_name;
// 					const detailedPrediction = {
// 						label: prediction.description.endsWith(', UK')
// 							? prediction.description.slice(0, -4)
// 							: prediction.description,
// 						id: prediction.place_id,
// 						name: null,
// 						address: prediction.description.endsWith(', UK')
// 							? prediction.description.slice(0, -4)
// 							: prediction.description,
// 						postcode: postalCode || '',
// 						type: 2,
// 						longitude: place.geometry.location.lng(),
// 						latitude: place.geometry.location.lat(),
// 					};
// 					resolve(detailedPrediction);
// 				} else {
// 					resolve(null);
// 				}
// 			});
// 		});
// 	}

// 	const handleSuggestionSelect = (suggestion) => {
// 		onPushChange(suggestion);
// 		setSuggestions([]);
// 		setHighlightedIndex(-1); // Reset highlighted index on selection
// 	};

// 	function handleBlur() {
// 		// Delay onBlur to allow option click to register
// 		setTimeout(() => {
// 			setBlur(true);
// 			setShowOption(false);
// 		}, 100);
// 	}

// 	const handleKeyDown = (event) => {
// 		if (showOption) {
// 			if (event.key === 'ArrowDown') {
// 				event.preventDefault();
// 				setHighlightedIndex((prevIndex) =>
// 					prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
// 				);
// 			} else if (event.key === 'ArrowUp') {
// 				event.preventDefault();
// 				setHighlightedIndex((prevIndex) =>
// 					prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
// 				);
// 			} else if (event.key === 'Enter' && highlightedIndex >= 0) {
// 				event.preventDefault();
// 				handleSuggestionSelect(suggestions[highlightedIndex]);
// 			}
// 		}
// 	};

// 	useEffect(() => {
// 		if (suggestions.length > 0) setShowOption(true);
// 		if (value.length < 3) {
// 			setSuggestions([]);
// 			setShowOption(false);
// 		}
// 	}, [suggestions.length, value.length]);

// 	return (
// 		<div className='relative'>
// 			<TextField
// 				value={value}
// 				onFocus={() => setBlur(false)}
// 				onBlur={handleBlur}
// 				onChange={handleInputChange}
// 				onKeyDown={handleKeyDown}
// 				label={placeholder}
// 				fullWidth
// 				required={true}
// 				onKeyDownCapture={handleChangeRef}
// 				autoComplete='new-password'
// 				id={Math.random().toString(36).substring(7)}
// 				className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full'
// 				inputRef={inputRef}
// 				onClick={handleClickRef}
// 			/>
// 			{showOption && !blur && (
// 				<ul className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[40vh] overflow-auto'>
// 					{suggestions.map((option, index) => (
// 						<li
// 							key={index}
// 							onClick={() => handleSuggestionSelect(option)}
// 							onMouseOver={() => {
// 								setHighlightedIndex(index);
// 								onPushChange(option);
// 							}}
// 							className={`px-4 py-2 cursor-pointer ${
// 								index === highlightedIndex ? 'bg-gray-100' : ''
// 							}`}
// 						>
// 							{option.label}
// 						</li>
// 					))}
// 				</ul>
// 			)}
// 		</div>
// 	);
// }

// export default PlaceAutocomplete;

/** @format */
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import {
	getAddressSuggestions,
	getAddressDetails,
	getPoi,
} from '../utils/apiReq';

function GoogleAutoComplete({
	placeholder,
	value,
	onChange,
	onPushChange, // This will push both the full address and postcode to the parent
	inputRef,
	handleChangeRef,
	handleClickRef,
}) {
	const [suggestions, setSuggestions] = useState([]);
	const [showOption, setShowOption] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [blur, setBlur] = useState(false);

	// Handle input change and fetch address suggestions from both sources
	const handleInputChange = async (event) => {
		onChange(event); // Update the input field in the parent component
		const input = event.target.value;
		setHighlightedIndex(-1); // Reset highlighted index

		// Fetch suggestions if input length is greater than or equal to 3
		if (input.length >= 4) {
			try {
				// Fetch local API suggestions (getPoi)
				const localSuggestions = await getPoi(input);
				const localFormatted = localSuggestions.map((poi) => ({
					label: `${poi.address}, ${poi.postcode || 'No Postcode'}`,
					id: poi.id,
					name: poi.name,
					address: poi.address || 'Unknown Address',
					postcode: poi.postcode || 'No Postcode',
					longitude: poi.longitude,
					latitude: poi.latitude,
					source: 'local',
				}));

				// Fetch getAddress.io suggestions
				const addressSuggestions = await getAddressSuggestions(input);
				const addressFormatted = addressSuggestions.map((suggestion) => ({
					label: `${suggestion.address}, ${
						suggestion.postcode || 'No Postcode'
					}`,
					id: suggestion.id,
					longitude: suggestion.longitude,
					latitude: suggestion.latitude,
					postcode: suggestion.postcode || 'No Postcode',
					address: suggestion.address || 'Unknown Address',
					source: 'getAddress',
				}));

				// Combine local suggestions first, followed by getAddress.io suggestions
				const combinedSuggestions = [...localFormatted, ...addressFormatted];
				setSuggestions(combinedSuggestions);
			} catch (error) {
				console.error('Error fetching address suggestions:', error);
				setSuggestions([]); // Clear suggestions on error
			}
		} else {
			setSuggestions([]); // Clear suggestions if input is too short
		}
	};

	// Handle suggestion selection
	const handleSuggestionSelect = async (suggestion) => {
		let selectedAddress = suggestion.address || 'Unknown Address';
		let selectedPostcode = suggestion.postcode || 'No Postcode';

		// If the suggestion is from getAddress.io, fetch full details before updating the form
		if (suggestion.source === 'getAddress') {
			try {
				const fullDetails = await getAddressDetails(suggestion.id);

				if (fullDetails) {
					selectedAddress =
						fullDetails.formatted_address.join(', ') || 'Unknown Address';
					selectedPostcode = fullDetails.postcode || 'No Postcode';
				}
			} catch (error) {
				console.error('Error fetching full address details:', error);
			}
		}

		// Update the input field directly with the selected address
		onChange({ target: { value: selectedAddress } });

		// Push both the selected address and postcode to the parent component
		onPushChange({
			address: selectedAddress,
			postcode: selectedPostcode,
		});

		// Clear suggestions and reset highlighted index
		setSuggestions([]);
		setHighlightedIndex(-1);
	};

	// Handle blur to close the suggestions list
	const handleBlur = () => {
		setTimeout(() => {
			setBlur(true);
			setShowOption(false);
		}, 100); // Delay to allow click to register
	};

	// Handle keyboard navigation in the suggestions list
	const handleKeyDown = (event) => {
		if (showOption) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				setHighlightedIndex((prevIndex) =>
					prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
				);
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				setHighlightedIndex((prevIndex) =>
					prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
				);
			} else if (event.key === 'Enter' && highlightedIndex >= 0) {
				event.preventDefault();
				handleSuggestionSelect(suggestions[highlightedIndex]);
			}
		}
	};

	// Show the suggestions dropdown if there are suggestions and no blur
	useEffect(() => {
		if (suggestions.length > 0) setShowOption(true);
		if (value.length < 3) {
			setSuggestions([]);
			setShowOption(false);
		}
	}, [suggestions.length, value.length]);

	return (
		<div className='relative'>
			<TextField
				value={value}
				onFocus={() => setBlur(false)}
				onBlur={handleBlur}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				label={placeholder}
				fullWidth
				required={true}
				onKeyDownCapture={handleChangeRef}
				autoComplete='new-password'
				id={Math.random().toString(36).substring(7)}
				className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full'
				inputRef={inputRef}
				onClick={handleClickRef}
			/>
			{showOption && !blur && (
				<ul className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[40vh] overflow-auto'>
					{suggestions.map((option, index) => (
						<li
							key={index}
							onClick={() => handleSuggestionSelect(option)}
							onMouseOver={() => setHighlightedIndex(index)}
							className={`px-4 py-2 cursor-pointer ${
								index === highlightedIndex ? 'bg-gray-100' : ''
							}`}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default GoogleAutoComplete;
