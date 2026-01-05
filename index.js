// // javascript with firebase

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
// import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// // Firebase Config (Using your provided config)
// const firebaseConfig = {
//     apiKey: "AIzaSyBfs-GMlEDsOZqsrv4pDwNCqsXCneFtxVs",
//     authDomain: "blogging-platform-4a29a.firebaseapp.com",
//     projectId: "blogging-platform-4a29a",
//     storageBucket: "blogging-platform-4a29a.firebasestorage.app",
//     messagingSenderId: "1068263010948",
//     appId: "1:1068263010948:web:1c6cadbd5ed065581608d1"
// };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Cloudinary Config (Using your provided values)
// const CLOUDINARY_CLOUD_NAME = 'dxqq2camc';
// const CLOUDINARY_UPLOAD_PRESET = 'blogging-platform';

// document.addEventListener('DOMContentLoaded', () => {
//     // All code goes inside this block to ensure DOM is loaded

//     // DOM Elements
//     const authSection = document.getElementById('auth-section');
//     const dashboard = document.getElementById('dashboard');
//     const blogDetails = document.getElementById('blog-details');
//     const addEditBlog = document.getElementById('add-edit-blog');
//     const authForm = document.getElementById('auth-form');
//     const authToggle = document.getElementById('auth-toggle');
//     const toggleLink = document.getElementById('toggle-link');
//     const googleLogin = document.getElementById('google-login');
//     const forgotPassword = document.getElementById('forgot-password');
//     const logoutBtn = document.getElementById('logout');
//     const addBlogBtn = document.getElementById('add-blog');
//     const myBookmarksBtn = document.getElementById('my-bookmarks');
//     const searchInput = document.getElementById('search');
//     const categoryFilter = document.getElementById('category-filter');
//     const sortFilter = document.getElementById('sort-filter');
//     const blogList = document.getElementById('blog-list');
//     const loadMoreBtn = document.getElementById('load-more');
//     const blogContent = document.getElementById('blog-content');
//     const likeBtn = document.getElementById('like-btn');
//     const bookmarkBtn = document.getElementById('bookmark-btn');
//     const editBlogBtn = document.getElementById('edit-blog');
//     const deleteBlogBtn = document.getElementById('delete-blog');
//     const blogForm = document.getElementById('blog-form');
//     const cancelBlogBtn = document.getElementById('cancel-blog');
//     const backToListBtn = document.getElementById('back-to-list');

//     // State
//     let currentUser = null;
//     let lastVisible = null;
//     let currentBlogId = null;
//     let isSignup = false;
//     let isBookmarkedView = false;
//     let editingBlog = false;

//     // Auth State Listener
//     onAuthStateChanged(auth, (user) => {
//         currentUser = user;
//         if (user) {
//             authSection.style.display = 'none';
//             dashboard.style.display = 'block';
//             loadBlogs();
//         } else {
//             authSection.style.display = 'block';
//             dashboard.style.display = 'none';
//             blogDetails.style.display = 'none';
//             addEditBlog.style.display = 'none';
//         }
//     });

//     // Auth Functions
//     authForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         try {
//             if (isSignup) {
//                 await createUserWithEmailAndPassword(auth, email, password);
//                 alert('Account created! Please login.');
//             } else {
//                 await signInWithEmailAndPassword(auth, email, password);
//             }
//         } catch (error) {
//             alert(error.message);
//         }
//     });

//     toggleLink.addEventListener('click', () => {
//         isSignup = !isSignup;
//         document.getElementById('auth-title').textContent = isSignup ? 'Join Us' : 'Welcome Back';
//         document.getElementById('auth-btn').textContent = isSignup ? 'Sign Up' : 'Login';
//         document.getElementById('name').style.display = isSignup ? 'block' : 'none';
//         authToggle.innerHTML = isSignup ? 'Already have an account? <a href="#" id="toggle-link">Login</a>' : 'New here? <a href="#" id="toggle-link">Sign Up</a>';
//     });

//     googleLogin.addEventListener('click', async () => {
//         const provider = new GoogleAuthProvider();
//         try {
//             await signInWithPopup(auth, provider);
//         } catch (error) {
//             alert(error.message);
//         }
//     });

//     forgotPassword.addEventListener('click', async () => {
//         const email = document.getElementById('email').value;
//         if (email) {
//             try {
//                 await sendPasswordResetEmail(auth, email);
//                 alert('Password reset email sent!');
//             } catch (error) {
//                 alert(error.message);
//             }
//         } else {
//             alert('Enter your email first.');
//         }
//     });

//     logoutBtn.addEventListener('click', async () => {
//         try {
//             await signOut(auth);
//             alert('Logged out successfully!');
//         } catch (error) {
//             alert(error.message);
//         }
//     });

//     // Blog Functions
//     async function uploadImage(file) {
//         if (!file) return null;
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
//         try {
//             const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
//                 method: 'POST',
//                 body: formData
//             });
//             const data = await response.json();
//             return data.secure_url;
//         } catch (error) {
//             alert('Image upload failed: ' + error.message);
//             return null;
//         }
//     }

//     async function loadBlogs(loadMore = false) {
//         let q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(10));
//         if (loadMore && lastVisible) q = query(q, startAfter(lastVisible));
//         if (categoryFilter.value) q = query(q, where('category', '==', categoryFilter.value));
//         if (sortFilter.value === 'likes') q = query(collection(db, 'blogs'), orderBy('likes', 'desc'), limit(10));
//         if (isBookmarkedView) {
//             const bookmarks = await getDocs(query(collection(db, 'bookmarks'), where('userId', '==', currentUser.uid)));
//             const blogIds = bookmarks.docs.map(b => b.data().blogId);
//             if (blogIds.length === 0) {
//                 blogList.innerHTML = '<p>No bookmarks yet.</p>';;
//                 return;
//             }
//             q = query(collection(db, 'blogs'), where('__name__', 'in', blogIds.slice(0, 10)));
//         }
//         const querySnapshot = await getDocs(q);
//         lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
//         blogList.innerHTML = loadMore ? blogList.innerHTML : '';
//         querySnapshot.forEach((doc) => {
//             const blog = doc.data();
//             const card = document.createElement('div');
//             card.className = 'blog-card';
//             card.innerHTML = `
//                 <img src="${blog.coverImage}" alt="Cover">
//                 <h3>${blog.title}</h3>
//                 <p>${blog.content.substring(0, 100)}...</p>
//                 <p>By ${blog.author} | ${blog.category}</p>
//                 <button onclick="viewBlog('${doc.id}')">Read More</button>
//             `;
//             blogList.appendChild(card);
//         });
//         loadMoreBtn.style.display = querySnapshot.docs.length === 10 ? 'block' : 'none';
//     }

//     window.viewBlog = async function(id) {
//         const querySnapshot = await getDocs(query(collection(db, 'blogs'), where('__name__', '==', id)));
//         const blog = querySnapshot.docs[0].data();
//         blogContent.innerHTML = `
//             <h2>${blog.title}</h2>
//             <p>By ${blog.author} on ${blog.date.toDate().toLocaleDateString()}</p>
//             <img src="${blog.coverImage}" alt="Cover">
//             <p>${blog.content}</p>
//             <p>Likes: ${blog.likes || 0}</p>
//         `;
//         currentBlogId = id;
//         dashboard.style.display = 'none';
//         blogDetails.style.display = 'block';
//         if (blog.authorId === currentUser.uid) {
//             editBlogBtn.style.display = 'inline';
//             deleteBlogBtn.style.display = 'inline';
//         }
//     };

//     likeBtn.addEventListener('click', async () => {
//         const blogRef = doc(db, 'blogs', currentBlogId);
//         const blog = (await getDocs(query(collection(db, 'blogs'), where('__name__', '==', currentBlogId)))).docs[0].data();
//         await updateDoc(blogRef, { likes: (blog.likes || 0) + 1 });
//         viewBlog(currentBlogId);
//     });

//     bookmarkBtn.addEventListener('click', async () => {
//         const existing = await getDocs(query(collection(db, 'bookmarks'), where('userId', '==', currentUser.uid), where('blogId', '==', currentBlogId)));
//         if (!existing.empty) {
//             alert('Already bookmarked!');
//             return;
//         }
//         await addDoc(collection(db, 'bookmarks'), { userId: currentUser.uid, blogId: currentBlogId });
//         alert('Bookmarked!');
//     });

//     editBlogBtn.addEventListener('click', () => {
//         editingBlog = true;
//         document.getElementById('form-title').textContent = 'Edit Blog';
//         blogDetails.style.display = 'none';
//         addEditBlog.style.display = 'block';
//         // Pre-fill form (optional: fetch and fill)
//     });

//     deleteBlogBtn.addEventListener('click', async () => {
//         if (confirm('Delete this blog?')) {
//             await deleteDoc(doc(db, 'blogs', currentBlogId));
//             alert('Blog deleted!');
//             backToListBtn.click();
//         }
//     });

//     blogForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         // Get elements and check if they exist
//         const titleElement = document.getElementById('blog-title');
//         const contentElement = document.getElementById('blog-text');
//         const categoryElement = document.getElementById('blog-category');
        
//         if (!titleElement || !contentElement || !categoryElement) {
//             alert('Form elements not found. Please refresh the page.');
//             return;
//         }
        
//         const title = titleElement.value.trim();
//         const content = contentElement.value.trim();
//         const category = categoryElement.value;

//         // Validation
//         if (!title || !content || !category) {
//             alert('Please fill in all required fields (title, content, category).');
//             return;
//         }

//         const coverImage = await uploadImage(document.getElementById('cover-image')?.files?.[0]);
//         const uploadImageUrl = await uploadImage(document.getElementById('upload-image')?.files?.[0]);

//         const blogData = {
//             title: title || '',
//             content: content || '',
//             coverImage: coverImage || '',
//             uploadImage: uploadImageUrl || '',
//             category: category || '',
//             author: currentUser?.email || '',
//             authorId: currentUser?.uid || '',
//             date: Timestamp.fromDate(new Date()),
//             likes: 0
//         };

//         try {
//             if (editingBlog) {
//                 await updateDoc(doc(db, 'blogs', currentBlogId), blogData);
//                 alert('Blog updated!');
//             } else {
//                 await addDoc(collection(db, 'blogs'), blogData);
//                 alert('Blog added!');
//             }
//             addEditBlog.style.display = 'none';
//             dashboard.style.display = 'block';
//             loadBlogs();
//         } catch (error) {
//             alert('Error saving blog: ' + error.message);
//             console.error(error);
//         }
//     });

//     cancelBlogBtn.addEventListener('click', () => {
//         addEditBlog.style.display = 'none';
//         dashboard.style.display = 'block';
//         editingBlog = false;
//     });

//     backToListBtn.addEventListener('click', () => {
//         blogDetails.style.display = 'none';
//         dashboard.style.display = 'block';
//         loadBlogs();
//     });

//     addBlogBtn.addEventListener('click', () => {
//         editingBlog = false;
//         document.getElementById('form-title').textContent = 'Add New Blog';
//         dashboard.style.display = 'none';
//         addEditBlog.style.display = 'block';
//     });

//     myBookmarksBtn.addEventListener('click', () => {
//         isBookmarkedView = !isBookmarkedView;
//         myBookmarksBtn.textContent = isBookmarkedView ? '⭐ My Bookmarks (Viewing)' : '⭐ My Bookmarks';
//         loadBlogs();
//     });

//     searchInput.addEventListener('input', loadBlogs);
//     categoryFilter.addEventListener('change', loadBlogs);
//     sortFilter.addEventListener('change', loadBlogs);
//     loadMoreBtn.addEventListener('click', () => loadBlogs(true));
// });






// JavaScript with Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBfs-GMlEDsOZqsrv4pDwNCqsXCneFtxVs",
    authDomain: "blogging-platform-4a29a.firebaseapp.com",
    projectId: "blogging-platform-4a29a",
    storageBucket: "blogging-platform-4a29a.firebasestorage.app",
    messagingSenderId: "1068263010948",
    appId: "1:1068263010948:web:1c6cadbd5ed065581608d1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = 'dxqq2camc';
const CLOUDINARY_UPLOAD_PRESET = 'blogging-platform';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authSection = document.getElementById('auth-section');
    const dashboard = document.getElementById('dashboard');
    const blogDetails = document.getElementById('blog-details');
    const addEditBlog = document.getElementById('add-edit-blog');
    const authForm = document.getElementById('auth-form');
    const authToggle = document.getElementById('auth-toggle');
    const toggleLink = document.getElementById('toggle-link');
    const googleLogin = document.getElementById('google-login');
    const forgotPassword = document.getElementById('forgot-password');
    const logoutBtn = document.getElementById('logout');
    const addBlogBtn = document.getElementById('add-blog');
    const myBookmarksBtn = document.getElementById('my-bookmarks');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const blogList = document.getElementById('blog-list');
    const loadMoreBtn = document.getElementById('load-more');
    const blogContent = document.getElementById('blog-content');
    const likeBtn = document.getElementById('like-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');
    const editBlogBtn = document.getElementById('edit-blog');
    const deleteBlogBtn = document.getElementById('delete-blog');
    const blogForm = document.getElementById('blog-form');
    const cancelBlogBtn = document.getElementById('cancel-blog');
    const backToListBtn = document.getElementById('back-to-list');

    // State
    let currentUser = null;
    let lastVisible = null;
    let currentBlogId = null;
    let isSignup = false;
    let isBookmarkedView = false;
    let editingBlog = false;

    // Auth State Listener
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            authSection.style.display = 'none';
            dashboard.style.display = 'block';
            loadBlogs();
        } else {
            authSection.style.display = 'block';
            dashboard.style.display = 'none';
            blogDetails.style.display = 'none';
            addEditBlog.style.display = 'none';
        }
    });

    // Auth Functions
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created! Please login.');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert(error.message);
        }
    });

    toggleLink.addEventListener('click', () => {
        isSignup = !isSignup;
        document.getElementById('auth-title').textContent = isSignup ? 'Join Us' : 'Welcome Back';
        document.getElementById('auth-btn').textContent = isSignup ? 'Sign Up' : 'Login';
        document.getElementById('name').style.display = isSignup ? 'block' : 'none';
        authToggle.innerHTML = isSignup ? 'Already have an account? <a href="#" id="toggle-link">Login</a>' : 'New here? <a href="#" id="toggle-link">Sign Up</a>';
    });

    googleLogin.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            alert(error.message);
        }
    });

    forgotPassword.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert('Password reset email sent!');
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert('Enter your email first.');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert('Logged out successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Upload image to Cloudinary
    async function uploadImage(file) {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            alert('Image upload failed: ' + error.message);
            return null;
        }
    }

    // Load blogs function
    async function loadBlogs(loadMore = false) {
        try {
            let q;

            if (isBookmarkedView) {
                // Bookmarked blogs
                const bookmarksSnap = await getDocs(query(collection(db, 'bookmarks'), where('userId', '==', currentUser.uid)));
                const blogIds = bookmarksSnap.docs.map(doc => doc.data().blogId);

                if (!blogIds || blogIds.length === 0) {
                    blogList.innerHTML = `
                        <div class="empty-state">
                            🔖 No bookmarks yet
                            <p>Save blogs you love 💜</p>
                        </div>
                    `;
                    loadMoreBtn.style.display = 'none';
                    return;
                }

                q = query(collection(db, 'blogs'), where('__name__', 'in', blogIds.slice(0, 10)));
            } else {
                // Normal blog list
                q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(10));

                if (loadMore && lastVisible) q = query(q, startAfter(lastVisible));
                if (categoryFilter.value) q = query(collection(db, 'blogs'), where('category', '==', categoryFilter.value));
                if (sortFilter.value === 'likes') q = query(collection(db, 'blogs'), orderBy('likes', 'desc'), limit(10));
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                blogList.innerHTML = `
                    <div class="empty-state">
                        ⚠️ No bookmark yet
                    </div>
                `;
                loadMoreBtn.style.display = 'none';
                return;
            }

            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            blogList.innerHTML = loadMore ? blogList.innerHTML : '';

            querySnapshot.forEach((doc) => {
                const blog = doc.data();
                const card = document.createElement('div');
                card.className = 'blog-card';
                card.innerHTML = `
                    <img src="${blog.coverImage}" alt="Cover">
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 100)}...</p>
                    <p>By ${blog.author} | ${blog.category}</p>
                    <button onclick="viewBlog('${doc.id}')">Read More</button>
                `;
                blogList.appendChild(card);
            });

            loadMoreBtn.style.display = querySnapshot.docs.length === 10 ? 'block' : 'none';

        } catch (error) {
            console.error('Error loading blogs:', error);
            blogList.innerHTML = `
                <div class="empty-state">
                    ⚠️ Error loading blogs
                </div>
            `;
            loadMoreBtn.style.display = 'none';
        }
    }

    // View Blog
    window.viewBlog = async function(id) {
        const querySnapshot = await getDocs(query(collection(db, 'blogs'), where('__name__', '==', id)));
        const blog = querySnapshot.docs[0].data();
        blogContent.innerHTML = `
            <h2>${blog.title}</h2>
            <p>By ${blog.author} on ${blog.date.toDate().toLocaleDateString()}</p>
            <img src="${blog.coverImage}" alt="Cover">
            <p>${blog.content}</p>
            <p>Likes: ${blog.likes || 0}</p>
        `;
        currentBlogId = id;
        dashboard.style.display = 'none';
        blogDetails.style.display = 'block';
        editBlogBtn.style.display = blog.authorId === currentUser.uid ? 'inline' : 'none';
        deleteBlogBtn.style.display = blog.authorId === currentUser.uid ? 'inline' : 'none';
    };

    // Like blog
    likeBtn.addEventListener('click', async () => {
        const blogRef = doc(db, 'blogs', currentBlogId);
        const blogSnap = await getDocs(query(collection(db, 'blogs'), where('__name__', '==', currentBlogId)));
        const blog = blogSnap.docs[0].data();
        await updateDoc(blogRef, { likes: (blog.likes || 0) + 1 });
        viewBlog(currentBlogId);
    });

    // Bookmark blog
    bookmarkBtn.addEventListener('click', async () => {
        const existing = await getDocs(query(collection(db, 'bookmarks'), where('userId', '==', currentUser.uid), where('blogId', '==', currentBlogId)));
        if (!existing.empty) {
            alert('Already bookmarked!');
            return;
        }
        await addDoc(collection(db, 'bookmarks'), { userId: currentUser.uid, blogId: currentBlogId });
        alert('Bookmarked!');
    });

    // Add/Edit/Delete blog
    editBlogBtn.addEventListener('click', () => {
        editingBlog = true;
        document.getElementById('form-title').textContent = 'Edit Blog';
        blogDetails.style.display = 'none';
        addEditBlog.style.display = 'block';
    });

    deleteBlogBtn.addEventListener('click', async () => {
        if (confirm('Delete this blog?')) {
            await deleteDoc(doc(db, 'blogs', currentBlogId));
            alert('Blog deleted!');
            backToListBtn.click();
        }
    });

    // Blog form submit
    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('blog-title').value.trim();
        const content = document.getElementById('blog-text').value.trim();
        const category = document.getElementById('blog-category').value;
        if (!title || !content || !category) { alert('Fill all fields'); return; }
        const coverImage = await uploadImage(document.getElementById('cover-image')?.files?.[0]);
        const blogData = {
            title, content, coverImage: coverImage || '', category,
            author: currentUser.email, authorId: currentUser.uid,
            date: Timestamp.fromDate(new Date()), likes: 0
        };
        if (editingBlog) {
            await updateDoc(doc(db, 'blogs', currentBlogId), blogData);
            alert('Blog updated!');
        } else {
            await addDoc(collection(db, 'blogs'), blogData);
            alert('Blog added!');
        }
        addEditBlog.style.display = 'none';
        dashboard.style.display = 'block';
        editingBlog = false;
        loadBlogs();
    });

    cancelBlogBtn.addEventListener('click', () => {
        addEditBlog.style.display = 'none';
        dashboard.style.display = 'block';
        editingBlog = false;
    });

    backToListBtn.addEventListener('click', () => {
        blogDetails.style.display = 'none';
        dashboard.style.display = 'block';
        loadBlogs();
    });

    addBlogBtn.addEventListener('click', () => {
        editingBlog = false;
        document.getElementById('form-title').textContent = 'Add New Blog';
        dashboard.style.display = 'none';
        addEditBlog.style.display = 'block';
    });

    myBookmarksBtn.addEventListener('click', () => {
        isBookmarkedView = !isBookmarkedView;
        myBookmarksBtn.textContent = isBookmarkedView ? '⭐ My Bookmarks (Viewing)' : '⭐ My Bookmarks';
        loadBlogs();
    });

    // Filters & Search
    searchInput.addEventListener('input', loadBlogs);
    categoryFilter.addEventListener('change', loadBlogs);
    sortFilter.addEventListener('change', loadBlogs);
    loadMoreBtn.addEventListener('click', () => loadBlogs(true));
});
