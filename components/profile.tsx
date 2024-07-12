import { useEffect, useState } from 'react';

interface UserInfo {
    name: string;
    family_name: string;
    email: string;
    phone_number: string;
    student_number: string;
}

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchUserInfo();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <p>Name: {userInfo.name}</p>
            <p>Family Name: {userInfo.family_name}</p>
            <p>Email: {userInfo.email}</p>
            <p>Phone Number: {userInfo.phone_number}</p>
            <p>Student Number: {userInfo.student_number}</p>
        </div>
    );
};

export default UserProfile;
