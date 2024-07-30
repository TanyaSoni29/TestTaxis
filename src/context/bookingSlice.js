/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { makeBooking } from './../utils/apiReq';
import { formatDate } from './../utils/formatDate';

const initialState = [
	{
		details: '',
		email: '',
		durationText: '20',
		isAllDay: false,
		passengerName: '',
		passengers: 1,
		paymentStatus: 0,
		scope: 0,
		phoneNumber: '',
		pickupAddress: '',
		pickupDateTime: formatDate(new Date()),
		pickupPostCode: '',
		destinationAddress: '',
		destinationPostCode: '',
		recurrenceRule: '',
		price: 0,
		priceAccount: 0,
		chargeFromBase: false,
		userId: '',
		returnDateTime: '',
		vias: [],
		accountNumber: 0,
		bookedByName: '',
		returnBooking: false,
		isReturn: false,
		hours: 0,
		minutes: 20,
		repeatBooking: false,
		frequency: 'none',
		repeatEnd: 'never',
		repeatEndValue: '',
		driver: {},
		formBusy: false,
		isLoading: false,
	},
];

const bookingFormSlice = createSlice({
	name: 'bookingForm',
	initialState,
	reducers: {
		updateDataValue: {
			prepare(itemIndex, property, value) {
				return { payload: { itemIndex, property, value } };
			},
			reducer(state, action) {
				const { itemIndex, property, value } = action.payload;
				state[itemIndex][property] = value;
			},
		},
		addData(state, action) {
			state.push(action.payload);
		},
		endBooking(state, action) {
			const { itemIndex } = action.payload;
			if (itemIndex === 0) {
				state[itemIndex] = initialState[0];
			} else {
				state.splice(itemIndex, 1);
			}
		},
	},
});

export const updateValue = function (itemIndex, property, value) {
	return function (dispatch, getState) {
		const targetBooking = getState().bookingForm[itemIndex];
		if (!targetBooking.formBusy) {
			dispatch(
				bookingFormSlice.actions.updateDataValue(itemIndex, 'formBusy', true)
			);
		}
		dispatch(
			bookingFormSlice.actions.updateDataValue(itemIndex, property, value)
		);
	};
};

export const onCreateBooking = (itemIndex) => async (dispatch, getState) => {
	const targetBooking = getState().bookingForm[itemIndex];
	const response = await makeBooking(targetBooking, true);
	if (response.status === 'success') {
		dispatch(endBooking({ itemIndex }));
		return { status: 'success' };
	} else {
		dispatch(updateValue({ itemIndex, property: 'isLoading', value: false }));
		return { status: 'error', message: response.message };
	}
};

export const onUpdateBooking = (itemIndex) => async (dispatch, getState) => {
	const targetBooking = getState().bookingForm[itemIndex];
	const response = await makeBooking(targetBooking);
	if (response.status === 'success') {
		dispatch(endBooking({ itemIndex }));
		return { status: 'success' };
	} else {
		dispatch(updateValue({ itemIndex, property: 'isLoading', value: false }));
		return { status: 'error', message: response.message };
	}
};

export const updateValueSilentMode =
	(itemIndex, property, value) => (dispatch) => {
		dispatch({
			type: 'bookingForm/updateDataValue',
			payload: { itemIndex, property, value },
		});
	};

export const removeBooking = (itemIndex) => (dispatch) => {
	dispatch(endBooking({ itemIndex }));
};

export const { addData, endBooking } = bookingFormSlice.actions;

export default bookingFormSlice.reducer;
