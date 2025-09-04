import React, { useState } from "react";
import styles from "./account.module.css";
import UploadIcon from "@/assets/uploadIcon.svg";
import { useAuthStore } from "@/context";

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const { userData } = useAuthStore();
    const [name, setName] = useState<string>(userData?.name);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className={styles.accountContainer}>
            <h2 className={styles.title}>MY ACCOUNT</h2>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("profile")}
                >
                    Edit Profile
                </button>
                <button
                    className={`${styles.tab} ${activeTab === "password" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("password")}
                >
                    Change Password
                </button>
            </div>

            {activeTab === "profile" && (
                <div className={styles.profileSection}>
                    <div className={styles.imageUpload}>
                        <label htmlFor="fileInput" className={styles.imageLabel}>
                            <img src={uploadedImage ? uploadedImage : userData?.photoUrl} alt="profile" className={styles.profileImg} />

                            <div className={styles.overlay}>
                                <img src={UploadIcon} alt="" width={50} />
                            </div>

                        </label>
                        <input
                            hidden
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label>Name</label>
                        </div>

                        <div className={styles.inputGroup}>
                            <input type="email" value={userData?.email} disabled />
                            <label>Email</label>
                        </div>


                        <button type="submit" className={styles.saveBtn}>
                            Save
                        </button>
                    </form>
                </div>
            )}

            {activeTab === "password" && (
                <div className={styles.passwordSection}>
                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <input type="password" required />
                            <label>Current Password</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="password" required />
                            <label>New Password</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="password" required />
                            <label>Confirm Password</label>
                        </div>
                        <button type="submit" className={styles.saveBtn}>
                            Update Password
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Account;
