# Arto OG Backend

## Features
* Locker:
    * [x] Changing items.
    * [x] Changing banner icon and banner color.
    * [x] Changing item edit styles.
    * [x] Favoriting items.
    * [x] Marking items as seen.
* Friends:
    * [x] Adding friends.
    * [x] Accepting friend requests.
    * [x] Removing friends.
    * [x] Blocking friends.
    * [x] Setting nicknames.
    * [x] Removing nicknames.
* Item Shop:
    * [x] Customizable Item Shop.
    * [x] Purchasing items from the Item Shop.
    * [x] Gifting items to your friends.
    * [x] Working Auto Item Shop.
* Refunding:
    * [x] Working refunding stuff.
* Discord Bot:
    * [x] Being able to activate/deactivate the Discord bot.
    * [x] Commands with very useful functions.
* BattlePass (s10):
    * [x] Possibility to buy the battle pass.
    * [x] Possibility to purchase battle pass levels.
    * [x] Possibility to gift the battle pass (BETA).
* Challenges (Backend Part):
    * [x] Daily missions worked.
    * [x] Working weekly missions.
    * [x] You can replace daily quests.
    * [x] You can get help from your party to complete missions.
* In-Game Events:
    * [x] You will be able to activate various events that occurred in the game such as the rift in the sky and much more!
* Winterfest Event (11.31, 19.01 & 23.10 / BETA):
    * [x] The winterfest event should work with all its rewards!
* SAC (Support A Creator):
    * [x] It supports a supported creator, you can set it using the `/createsac {code} {ingame-username}` command on discord.
    * [x] Rewards in vbucks for those who support a creator.
* Matchmaker:
    * [x] An improved matchmaker.
* Multiple Gameserver Support:
    * [x] An improved multiple gameserver.
* Website:
    * [x] A simple website where you can create an account to join the game.
* XMPP:
    * [x] Parties.
    * [x] Chat (whispering, global chat, party chat).
    * [x] Friends.
* HTTPS/SSL Support:
    * [x] A working https/ssl system.

## TO-DO
- [ ] Differentiate ports between xmpp and matchmaker
- [ ] Create a support with save the world
- [ ] Create a support with creative

## Discord Bot Commands
### User Commands:
- `/create {email} {username} {password}` - Creates an account on the backend (You can only create 1 account).
- `/details` - Retrieves your account info.
- `/lookup {username}` - Retrieves someones account info.
- `/exchange-code` - Generates an exchange code for login. (One time use for each code and if not used it expires after 5 mins).
- `/change-username {newUsername}` - You can change your username using this command.
- `/change-email {newEmail}` - You can change your email using this command.
- `/change-password {newPassword}` - You can change your password using this command.
- `/sign-out-of-all-sessions` - Signs you out if you have an active session.
- `/vbucksamount` - Shows how many vbucks to the user
- `/giftvbucks {username}` - Send another user your V-Bucks.
- `/claimvbucks` - Claim your daily {idk the default is 250} V-Bucks
### Admin Commands:
- You can only use the admin commands if you are a moderator.
- `/addall {user}` - Allows you to give a user all cosmetics. Note: This will reset all your lockers to default
- `/addvbucks {user} {vbucks}` - Lets you change a users amount of vbucks
- `/additem {user} {cosmeticname}` - The name of the cosmetic you want to give
- `/create-custom-match-code {code} {ip} {port}` - Create a custom matchmaking code.
- `/ban {targetUsername}` - Ban a user from the backend by their username.
- `/createhostaccount` - Creates a host account for Reload Backend.
- `/createsac {code} {ingame-username}` - Creates a Support A Creator Code.
- `/custom-match-code-list` - Lists all custom matchmaking codes.
- `/delete {username}` - Deletes a users account
- `/deletediscord {username}` - Deletes a users account
- `/deletesac {username}` - Deletes a Support A Creator Code.
- `/kick {targetUsername}` - Kick someone out of their current session by their username.
- `/removevbucks {user} {vbucks}` - Lets you change a users amount of vbucks
- `/removeitem {user} {cosmeticname}` - Allows you to remove a cosmetic (skin, pickaxe, glider, etc.) from a user
- `/unban {targetUsername}` - Unban a user from the backend by their username.
