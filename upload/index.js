window.onload = function () {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCbYgKsLwT819yJAbSRj0WbsR0kB9yX14g",
        authDomain: "quickcollab-ca6b3.firebaseapp.com",
        projectId: "quickcollab-ca6b3",
        storageBucket: "quickcollab-ca6b3.appspot.com",
        messagingSenderId: "989667043453",
        appId: "1:989667043453:web:9a2c48e1a04ed4e64aa914",
        measurementId: "G-P4S14VX3SG"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // This is very IMPORTANT!! We're going to use "db" a lot.
    var db = firebase.database();
    var storage = firebase.storage();

    class MEME_CHAT {
        home() {
            document.body.innerHTML = '';
            this.create_title();
            this.create_join_form();
        }

        chat() {
            this.create_title();
            this.create_chat();
        }

        create_title() {
            var title_container = document.createElement('div');
            title_container.setAttribute('id', 'title_container');
            var title_inner_container = document.createElement('div');
            title_inner_container.setAttribute('id', 'title_inner_container');

            var title = document.createElement('h1');
            title.setAttribute('id', 'title');
            title.textContent = 'quickcollab';

            title_inner_container.append(title);
            title_container.append(title_inner_container);
            document.body.append(title_container);
        }

        create_join_form() {
            var parent = this;

            var join_container = document.createElement('div');
            join_container.setAttribute('id', 'join_container');
            var join_inner_container = document.createElement('div');
            join_inner_container.setAttribute('id', 'join_inner_container');

            var join_button_container = document.createElement('div');
            join_button_container.setAttribute('id', 'join_button_container');

            var join_button = document.createElement('button');
            join_button.setAttribute('id', 'join_button');
            join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>';

            var join_input_container = document.createElement('div');
            join_input_container.setAttribute('id', 'join_input_container');

            var join_input = document.createElement('input');
            join_input.setAttribute('id', 'join_input');
            join_input.setAttribute('maxlength', 15);
            join_input.placeholder = "No.... It's Patrick Star";

            join_input.onkeyup = function () {
                if (join_input.value.length > 0) {
                    join_button.classList.add('enabled');
                    join_button.onclick = function () {
                        parent.save_name(join_input.value);
                        join_container.remove();
                        parent.create_chat();
                    };
                } else {
                    join_button.classList.remove('enabled');
                }
            };

            join_button_container.append(join_button);
            join_input_container.append(join_input);
            join_inner_container.append(join_input_container, join_button_container);
            join_container.append(join_inner_container);
            document.body.append(join_container);
        }

        create_load(container_id) {
            var container = document.createElement('div');
            container.setAttribute('class', 'loader_container');
            container.setAttribute('id', 'loader_container');

            var loader = document.createElement('div');
            loader.setAttribute('class', 'loader');

            container.append(loader);
            document.getElementById(container_id).append(container);
        }

        remove_load() {
            var loader = document.getElementById('loader_container');
            if (loader != null) {
                loader.remove();
            }
        }

        create_chat() {
            var parent = this;
            var chat_container = document.createElement('div');
            chat_container.setAttribute('id', 'chat_container');
            var chat_inner_container = document.createElement('div');
            chat_inner_container.setAttribute('id', 'chat_inner_container');
        
            var chat_content_container = document.createElement('div');
            chat_content_container.setAttribute('id', 'chat_content_container');
        
            var chat_input_container = document.createElement('div');
            chat_input_container.setAttribute('id', 'chat_input_container');
        
            var chat_input = document.createElement('input');
            chat_input.setAttribute('id', 'chat_input');
            chat_input.setAttribute('maxlength', 1000);
            chat_input.placeholder = `${localStorage.getItem('name')}. Say something...`;
        
            chat_input.onkeyup = function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if (chat_input.value.length > 0) {
                        parent.send_message(chat_input.value);
                        chat_input.value = '';
                        chat_input_send.classList.remove('enabled');
                    }
                } else {
                    if (chat_input.value.length > 0) {
                        chat_input_send.classList.add('enabled');
                    } else {
                        chat_input_send.classList.remove('enabled');
                    }
                }
            };
        
            var chat_input_send = document.createElement('button');
            chat_input_send.setAttribute('id', 'chat_input_send');
            chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`;
        
            chat_input_send.onclick = function () {
                if (chat_input.value.length > 0) {
                    parent.send_message(chat_input.value);
                    chat_input.value = '';
                    chat_input_send.classList.remove('enabled');
                }
            };
        
            var image_upload = document.createElement('input');
            image_upload.setAttribute('type', 'file');
            image_upload.setAttribute('id', 'image_upload');
            image_upload.setAttribute('accept', 'image/*');
        
            var upload_button = document.createElement('button');
            upload_button.setAttribute('id', 'upload_button');
            upload_button.innerHTML = '<i class="fas fa-upload"></i>';
        
            upload_button.onclick = function () {
                image_upload.click();
            };
        
            image_upload.onchange = function () {
                if (image_upload.files.length > 0) {
                    upload_button.classList.add('enabled');
                    parent.upload_image(image_upload.files[0]);
                }
            };
        
            var chat_logout_container = document.createElement('div');
            chat_logout_container.setAttribute('id', 'chat_logout_container');
        
            var chat_logout = document.createElement('button');
            chat_logout.setAttribute('id', 'chat_logout');
            chat_logout.textContent = `${localStorage.getItem('name')} • logout`;
        
            chat_logout.onclick = function () {
                localStorage.clear();
                parent.home();
            };
        
            var delete_button = document.createElement('button');
            delete_button.setAttribute('id', 'delete_button');
            delete_button.textContent = 'Delete Chat';
        
            delete_button.onclick = function () {
                if (confirm('Are you sure you want to delete all chat messages?')) {
                    if (db && db.ref) {
                        console.log('Attempting to delete chat messages');
                        db.ref('chats').remove()
                            .then(function () {
                                console.log('Chat messages deleted successfully');
                                document.getElementById('chat_content_container').innerHTML = '';
                            })
                            .catch(function (error) {
                                console.error('Error deleting chat messages:', error);
                            });
                    } else {
                        console.error('Firebase database reference (db) is not defined or incorrect');
                    }
                }
            };
        
            chat_logout_container.append(chat_logout, delete_button);
            chat_input_container.append(chat_input, chat_input_send, upload_button, image_upload);
            chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container);
            chat_container.append(chat_inner_container);
            document.body.append(chat_container);
        
            parent.create_load('chat_content_container');
        
            db.ref('chats').on('value', function (messages) {
                var chat_content_container = document.getElementById('chat_content_container');
                chat_content_container.innerHTML = '';
        
                messages.forEach(function (data) {
                    var message = data.val();
                    if (message.message) {
                        parent.create_message(message.name, message.message);
                    } else if (message.imageUrl) {
                        parent.create_image_message(message.name, message.imageUrl);
                    }
                });
        
                parent.remove_load();
            });
        }
        

        save_name(name) {
            localStorage.setItem('name', name);
        }

        send_message(message) {
            var name = localStorage.getItem('name');
            db.ref('chats').push({
                name: name,
                message: message
            });
        }
        upload_image(file) {
            var name = localStorage.getItem('name');
            var storageRef = storage.ref('images/' + file.name);
        
            // Create a FileReader object
            var reader = new FileReader();
        
            // Set up onload function for the FileReader object
            reader.onload = function(event) {
                // Create an Image object
                var img = new Image();
        
                // Set up onload function for the Image object
                img.onload = function() {
                    // Create a canvas element
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
        
                    // Set the canvas dimensions to the resized image dimensions
                    var MAX_WIDTH = 500; // Adjust this value as needed
                    var MAX_HEIGHT = 500; // Adjust this value as needed
                    var width = img.width;
                    var height = img.height;
        
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
        
                    canvas.width = width;
                    canvas.height = height;
        
                    // Draw the image onto the canvas
                    ctx.drawImage(img, 0, 0, width, height);
        
                    // Convert the canvas content to base64 data URL
                    var dataURL = canvas.toDataURL('image/jpeg');
        
                    // Upload the resized image to Firebase storage
                    storageRef.putString(dataURL, 'data_url')
                        .then(function(snapshot) {
                            // Get the download URL of the uploaded image
                            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                                // Push the download URL to the Firebase database
                                db.ref('chats').push({
                                    name: name,
                                    imageUrl: downloadURL
                                });
                            });
                        })
                        .catch(function(error) {
                            console.error('Error uploading image:', error);
                        });
                };
        
                // Set the src of the Image object to the uploaded file
                img.src = event.target.result;
            };
        
            // Read the uploaded file as a data URL
            reader.readAsDataURL(file);
        }
        

        create_message(name, message) {
            var message_container = document.createElement('div');
            message_container.setAttribute('class', 'message_container');

            if (name === localStorage.getItem('name')) {
                message_container.classList.add('own');
            }

            var message_user = document.createElement('p');
            message_user.setAttribute('class', 'message_user');
            message_user.textContent = name;

            var message_content = document.createElement('p');
            message_content.setAttribute('class', 'message_content');
            message_content.textContent = message;

            message_container.append(message_user, message_content);

            var chat_content_container = document.getElementById('chat_content_container');
            chat_content_container.append(message_container);

            chat_content_container.scrollTop = chat_content_container.scrollHeight;
        }

        create_image_message(name, imageUrl) {
            var message_container = document.createElement('div');
            message_container.setAttribute('class', 'message_container image_container');

            if (name === localStorage.getItem('name')) {
                message_container.classList.add('own');
            }

            var message_user = document.createElement('p');
            message_user.setAttribute('class', 'message_user');
            message_user.textContent = name;

            var message_image = document.createElement('img');
            message_image.setAttribute('src', imageUrl);

            message_container.append(message_user, message_image);

            var chat_content_container = document.getElementById('chat_content_container');
            chat_content_container.append(message_container);

            chat_content_container.scrollTop = chat_content_container.scrollHeight;
        }
    }

    var app = new MEME_CHAT();
    if (localStorage.getItem('name') != null) {
        app.chat();
    } else {
        app.home();
    }
};
