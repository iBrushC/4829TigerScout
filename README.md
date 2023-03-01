<a href="https://play.google.com/store/apps/details?id=com.team4829.tigerscout">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png" width="150">
</a>
<a href="https://apps.apple.com/us/app/tiger-scout/id1672824033">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png" width="150">
</a>

# TigerScout
TigerScout is an easy, open source cloud-integrated scouting app made by 4829. It allows for simple and objective scouting, along with useful statistics for strategizing and alliance selection. Firebase cloud integration allows for seamless data syncing, without having to worry about QR codes or CSV files.

All code written and maintained by Andrew M. Combs

## Features
- Fast and hassle-free per-team cloud storage with support with multiple folders
- Clean and easy user interface
- Team analytics, including averages and performance-over-time graphs for different statistics.

## Storage
TigerScout uses Firebase storage buckets to store data in the cloud, which you can see how to set up in the *Making a Bucket* section. However, because connection to the internet can be iffy in competitions, data is first stored locally on each device before being uploaded when the internet is available. 

Additionally, data from the cloud is downloaded and stored locally until a manual refresh is selected, or until the user disconnects from their current bucket. This helps prevent long load times each time the user checks the cloud data.

## Usage
- To scout a match, press the **Scout Team** button on the home screen. Fill out appropriate data, then press **Save Data**. This will save the match to your Local Data.
- To view or upload local data, press the **Local Data** button on the home screen. Every match stored on your local device is listed here.
	- To view or edit an individual match, press the white button with the filename on it. To save edited changes, press the **Save Data** button at the bottom. To cancel changes, press the back button.
	- The **X** button next to each match will delete that individual match. Be careful, because this will not ask you to confirm your decision, and you will not be able to recover a deleted match.
	- To delete all data, scroll to the bottom of the list and press **Delete Local Data**. You will have to confirm your decision, as deleted data cannot be recovered.
- To view cloud data, press the **Cloud Data** button on the home screen. If you're connected to a bucket, it should allow you to see any cloud data cached on your device.
	- To download cloud data, press the **⟳** button in the top left corner. This will download all current data from the cloud. You will have to do this every time you want the current data from the cloud.
	- The **Sort By** dropdown allows you to sort every team by their average statistics.
	- The **Reverse Order** checkbox reversed the order that teams are sorted by. When it is unchecked, teams are sorted in descending order, with the highest values at the top. When checked, it changes to ascending order, with the lowest values at the top.
	- Each team number is inside an orange button. Clicking that button will bring you to that team's analytics, including average values, a performance over time graph, all comments, and each individual match they've played.
- To connect to or disconnect from a bucket, press the **Settings** button on the home screen.
	- If you're already connected to a bucket, you'll see the bucket you're connect to, along with the subfolder. You'll have the option to disconnect with the **Disconnect** button. Once you disconnect, you will not longer have access to the cloud data, and will not be able to reconnect without re-entering the code.
	- If you're not connected, you'll have two options to get connected to a storage bucket:
		- If you have a functioning front camera, you can press **Scan QR Code**. Once the QR code is in view, it will automatically scan and prompt you with a password. If the correct password is entered, you will be automatically connected to the bucket
		- If you don't have a functioning front camera, you can press **Enter Text**. Paste in the given code and press **Ok**. You'll be prompted with a password. If the correct password is entered, you will be automatically connected to the bucket

## Making a Bucket
To get started, go to https://console.firebase.google.com and either log in or create an account. From here, you should be able to press **Add project**. Choose a name that makes sense, disable Google Analytics (or don't, TigerScout just doesn't use them), then press **Create project**. In the console, you should see a gear icon next to **Project Overview**: click it, then select **Project settings**. Scroll down to the bottom where it says **Your apps** and select the button with `</>` as the icon. Register the app as "TigerScout", continue then continue again back to the console.

Follow https://firebase.google.com/docs/storage/web/start#create-default-bucket to set up storage. Set the storage rules to 
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow create, update: if true;
      allow delete: if false;
    }
  }
}
```
This gives all users read and write access, but only allows the owner of the bucket to delete files through the console. Keep in mind that **TigerScout does not use authentication, which is why you shouldn't give your code and password to anyone you don't trust**.

Once everything above is set up, go to https://ibrushc.github.io/4829TigerScout/ and use the code generator tool. 
- **Bucket Name** is whatever name you want to show up in the app, and does not have to be connected to your Firebase bucket name. 
- **Cloud Config** is all the settings required to connect to your bucket, which you can find by going to your project settings and scrolling to the bottom. Copy and paste the `firebaseConfig` variable definition and paste it in, it should look like this:
```
const firebaseConfig = {
  apiKey: "[your apiKey]",
  authDomain: "[your authDomain]",
  projectId: "[your projectId]",
  storageBucket: "[your storageBucket]",
  messagingSenderId: "[your messagingSenderId]",
  appId: "[your appId]"
};
```
- **Subpath** is the subfolder where anyone who uses the code will send their data to. This could be used for multiple competitions, or and A and B team using the same bucket. 
- **Editor Permissions** allows the person who scans the code to upload to the bucket. If you just want someone to be able to see your data but not upload to it, uncheck this.
- **Password** is the password to get into the bucket. Everyone who connects through the code will have to enter the password correctly before being able to connect.

Then click **Create QR Code**. If something was entered wrong an error will pop up at the top, otherwise a QR and text code will be generated. You can download a 2000x2000px version with the **Download** button. If any team members don't have a functioning camera they can connect with the text code that appears below the QR code.

## Spreadsheet Downloader
Because teams may want to use their data outside of the app, there is an included tool at the bottom of https://ibrushc.github.io/4829TigerScout/ which downloads data to a spreadsheet in `xlsx` format, which is supported by both Excel and Google Sheets. Because Firebase will, by default, not allow random sources do download your data, you need to enable cross origin resource sharing (or *CORS*). To do this in your bucket, download the `cors.json` file from this repository and follow https://firebase.google.com/docs/storage/web/download-files#cors_configuration.

Unfortunately it can be an annoying process, but I couldn't find any better alternative. You should be able to check if CORS has been set correctly by downloading your data. If an error appears five seconds after you click **Download Spreadsheet**, the CORS policy has not been set correctly.

## Security Notice
While measures have been put in place to ensure that unwanted users cannot access edit data, I am far from a professional in cybersecurity and cannot guarantee security. To ensure that unwanted users don't have edit access to your data, do not share your bucket password with anyone you don't know and trust. If you wish to share data with someone you don't know, give them a code where they are only given viewer permissions (as seen in *Making a Bucket*) and enter the password for them.
