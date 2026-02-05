import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

/**
 * Check if username is already taken
 */
export async function checkUsernameExists(username) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
}

/**
 * Check if email is already registered
 */
export async function checkEmailExists(email) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }
  return { isValid: true, error: null };
}

/**
 * Register with email and password
 */
export async function registerWithEmail(email, password, userData) {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Check if username exists
    const usernameExists = await checkUsernameExists(userData.username);
    if (usernameExists) {
      throw new Error("Tên đăng nhập đã được sử dụng");
    }

    // Check if email exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      throw new Error("Email đã được đăng ký");
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user profile in Firestore
    const usersRef = collection(db, "users");
    await addDoc(usersRef, {
      uid: user.uid,
      email: email.toLowerCase(),
      username: userData.username.toLowerCase(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      address: userData.address.trim(),
      phone: userData.phone.trim(),
      authMethod: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      user,
      message: "Đăng ký thành công!",
    };
  } catch (error) {
    let errorMessage = "Lỗi đăng ký";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email này đã được sử dụng";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Mật khẩu quá yếu (tối thiểu 6 ký tự)";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Email không hợp lệ";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Register with Google
 */
export async function registerWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user already exists in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Create new user profile in Firestore
      await addDoc(usersRef, {
        uid: user.uid,
        email: user.email.toLowerCase(),
        username: user.displayName
          ? user.displayName.toLowerCase().replace(/\s+/g, "")
          : `user${Date.now()}`,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        address: "",
        phone: "",
        authMethod: "google",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return {
      success: true,
      user,
      message: "Đăng ký bằng Google thành công!",
    };
  } catch (error) {
    let errorMessage = "Lỗi đăng ký bằng Google";

    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Bạn đã đóng cửa sổ đăng ký";
    } else if (error.code === "auth/popup-blocked") {
      errorMessage = "Cửa sổ đăng ký bị chặn";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(identifier, password) {
  try {
    if (!identifier || !password) {
      throw new Error("Vui lòng nhập email hoặc tên đăng nhập và mật khẩu");
    }

    let loginEmail = identifier.trim();

    if (!loginEmail.includes("@")) {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", loginEmail.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: false,
          error: "Tên đăng nhập không tồn tại",
        };
      }

      loginEmail = querySnapshot.docs[0].data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      password
    );

    return {
      success: true,
      user: userCredential.user,
      message: "Đăng nhập thành công!",
    };
  } catch (error) {
    let errorMessage = "Lỗi đăng nhập";

    if (error.code === "auth/user-not-found") {
      errorMessage = "Tài khoản không tồn tại";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Mật khẩu không đúng";
    } else if (error.code === "auth/invalid-credential") {
      errorMessage = "Email hoặc mật khẩu không đúng";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Email không hợp lệ";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Login with Google
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(usersRef, {
        uid: user.uid,
        email: user.email.toLowerCase(),
        username: user.displayName
          ? user.displayName.toLowerCase().replace(/\s+/g, "")
          : `user${Date.now()}`,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        address: "",
        phone: "",
        authMethod: "google",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return {
      success: true,
      user,
      message: "Đăng nhập bằng Google thành công!",
    };
  } catch (error) {
    let errorMessage = "Lỗi đăng nhập bằng Google";

    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Bạn đã đóng cửa sổ đăng nhập";
    } else if (error.code === "auth/popup-blocked") {
      errorMessage = "Cửa sổ đăng nhập bị chặn";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Lỗi đăng xuất",
    };
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
