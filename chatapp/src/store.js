import { BehaviorSubject } from 'rxjs';

export const savedSocket$ = new BehaviorSubject(localStorage.getItem('socket'));

export function updateSavedSocket(data) {
	 if (data) {
         console.log(data)
		localStorage.setItem('socket',data);
	} else {
		localStorage.removeItem('socket');
	} 
	savedSocket$.next(data);
}

export const savedRoom$ = new BehaviorSubject(localStorage.getItem('rooms') || "");

export function updateSavedRoom(currentRoom) {
	 if (currentRoom) {
		localStorage.setItem('rooms', currentRoom);
	} else {
		localStorage.removeItem('rooms');
	} 
	savedRoom$.next(currentRoom);
}