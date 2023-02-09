# TigerScout
TigerScout is a easy, open source cloud-integrated scouting app made by 4829. It allows for simple and objective scouting, along with useful statistics for strategizing and alliance selection. Firebase cloud integration allows for seamless data syncing, without having to worry about QR codes or CSV files.
<sub>All code written and maintained by Andrew M. Combs</sub>

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
(INCLUDE INSTRUCTIONS HERE FOR HOW TO MAKE A BUCKET WITH FIREBASE)
(INCLUDE INSTRUCTIONS FOR USING ONLINE TOOL ONCE I MAKE IT)

## Security Notice
While measures have been put in place to ensure that unwanted users cannot access edit data, I am far from a professional in cybersecurity and cannot guarantee security. To ensure that unwanted users don't have edit access to your data, do not share your bucket password with anyone you don't know and trust. If you wish to share data with someone you don't know, give them a code where they are only given viewer permissions (as seen in *Making a Bucket*) and enter the password for them.
