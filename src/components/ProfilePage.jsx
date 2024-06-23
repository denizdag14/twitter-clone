"use client"

import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const db = getFirestore(app);

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const pathname = usePathname();
  const uid = pathname.split('/')[pathname.split('/').length - 1]

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('Kullanıcı bulunamadı.');
        }
      } catch (error) {
        console.error('Firestore\'dan veri getirme hatası:', error);
      }
    }

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  return (
    <div>
      {userData ? (
        <div>
          <h2>Kullanıcı Bilgileri</h2>
          <Image src={userData.image} alt='user-img' width={50} height={50} />
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {/* İhtiyacınıza göre diğer kullanıcı bilgilerini buraya ekleyebilirsiniz */}
        </div>
      ) : (
        <p>Kullanıcı bilgileri yükleniyor...</p>
      )}
    </div>
  );
}