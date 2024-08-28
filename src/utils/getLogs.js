/** @format */
import * as Sentry from '@sentry/react';
function appendToLocalStorage(newObject, key = 'SentryLog') {
	// Step 1: Retrieve existing data from local storage
	let existingData = localStorage.getItem(key);

	// Step 2: Parse existing data (if not null) or initialize an empty array
	let dataArray = existingData ? JSON.parse(existingData) : [];

	// Step 3: Append the new object to the array
	dataArray.push(newObject);

	// Step 4: Convert the updated array back to a string
	const updatedData = JSON.stringify(dataArray);

	// Step 5: Save the updated string back to local storage
	localStorage.setItem(key, updatedData);
}

export const sendLogs = (data, type) => {
	appendToLocalStorage(
		{ logType: type, ...data, logCreatedAt: Date.now() },
		'SentryLog'
	);
	if (type === 'info') {
		Sentry.captureMessage(data, type);
	} else if (type === 'error') {
		Sentry.captureException(data, type);
	}
};
