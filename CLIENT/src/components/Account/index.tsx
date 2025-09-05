import React, { useState } from "react";
import { useNotify } from "@/modules/Prompts/notify";
import styles from "./account.module.css";
import UploadIcon from "@/assets/uploadIcon.svg";
import { useAuthStore } from "@/context";
import userLogo from "@/assets/default.jpg"

const Account: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { userData } = useAuthStore();
    const [name, setName] = useState<string>(userData?.name);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const notify = useNotify();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userId", userData.id);
            if (name) formData.append("newName", name);
            if (uploadedImage) formData.append("file", uploadedImage);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-user`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                notify("Profile updated successfully!", "success");
            } else {
                notify(data.errorMessage || "Failed to update profile.", "error");
            }
        } catch (err) {
            notify("Server error. Try again later.", "error");
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (newPassword !== confirmPassword) {
            notify("New password and confirm password do not match.", "error");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData.id,
                    oldPassword,
                    newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                notify("Password changed successfully!", "success");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                notify(data.errorMessage || "Failed to change password.", "error");
            }
        } catch (err) {
            notify("Server error. Try again later.", "error");
        }
        setLoading(false);
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
                    <div onClick={() => { document.getElementById("fileInput")?.click(); }} className={styles.imageUpload}>
                    <img src={previewImage ? previewImage : userData?.imageData?.url || userLogo} alt="profile" className={styles.profileImg} />
                        <div className={styles.overlay}>
                            <img src={UploadIcon} alt="" width={50} />
                        </div>
                        <input
                            hidden
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <form className={styles.form} onSubmit={handleProfileSubmit}>
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
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        {/* Notification messages are now handled by useNotify */}
                    </form>
                </div>
            )}

            {activeTab === "password" && (
                <div className={styles.passwordSection}>
                    <form className={styles.form} onSubmit={handlePasswordSubmit}>
                        <div className={styles.inputGroup}>
                            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                            <label>Current Password</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            <label>New Password</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            <label>Confirm Password</label>
                        </div>
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                        {message && <div className={styles.message}>{message}</div>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default Account;
