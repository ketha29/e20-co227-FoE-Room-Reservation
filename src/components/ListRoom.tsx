import React, { useEffect, useState } from 'react'
import { deleteRoom, getAllRooms } from '../services/RoomService';
import AddRoomButton from './AddRoomButton';
import { AxiosError } from 'axios';
import DeleteConformation from './DeleteConfirmation';

type Room = {
    roomId: number;
    capacity: number;
    roomName: string;
    description: string;
}

const ListRoom = () => {
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [error, setError] = useState("");
    const [showDeleteConformation, setShowDeleteConformation] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Get all the room details from backend
    const fetchRooms = async () => {
        try{
            const response = await getAllRooms();
            setRoomList(response.data.roomList);
            // console.log(response.data.roomList);
        }
        catch(error) {
            setError((error as AxiosError).message);
        }
    }
    // Render room details once when the page is loaded
    useEffect(() => {
        fetchRooms();
    }, []);

    // Delete the selected room details
    const handleDelete = async (room: Room) => {        
        try {
            await deleteRoom(room.roomId);
            fetchRooms();
        } catch(error) {
            setError((error as AxiosError).message);
            console.log("Error in deleting room:", error);
        }
    }

    // Show the conformation dialog box
    const confirmDelete = (room: Room) => {
        setShowDeleteConformation(true);
        setSelectedRoom(room);
    };

    // Cancel deletion action
    const cancelDelete = () => {
        setShowDeleteConformation(false);
    }

    // Proceed with deletion
    const proceedDelete = () => {
        setShowDeleteConformation(false);
        selectedRoom && handleDelete(selectedRoom);
    }

    return (
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg mt-5'>
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className='bg-gray-200'>
                                    <tr>
                                        {/* <th scope='col' className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>ID</th> */}
                                        <th scope='col' className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>Room Name</th>
                                        <th scope='col' className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>Capacity</th>
                                        <th scope='col' className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>Description</th>
                                        <th scope='col' className='px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider'><AddRoomButton /></th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {
                                        roomList.map(room =>
                                            <tr key={room.roomId} className='hover:bg-gray-100'>
                                                {/* <td className='px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900'>{room.roomId}</td> */}
                                                <td className='px-6 py-4 whitespace-nowrap text-base text-gray-900'>{room.roomName}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-base text-gray-900'>{room.capacity}</td>
                                                <td className='px-6 py-4 whitespace-nowrap text-base text-gray-900'>{room.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button type="button" className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                    <button
                                                        onClick={() => confirmDelete(room)}
                                                        type="button"
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Show the deletion confiramation component */}
            {showDeleteConformation && (
                <DeleteConformation
                    deleteItem={`Room ${selectedRoom?.roomName}`}
                    onConfirm={proceedDelete} 
                    onCancel={cancelDelete}
                />
            )};
        </div>
    )
}

export default ListRoom
