Our project aims to provide a visual illustration for the DND game using unity and a react app.

The application serves as the main control panen for the plane. This is where users can join groups, select the characters they want to be with and perform certain actions during the game.

The application consists of 10 screens in total:

1. Welcome
2. Login
3. Signup
4. Verify your email
5. Join a group
6. Create a group
7. Design your character
8. Play view
9. Dice view
10. Action view

There is no need to collect any personal information from the user, only email address for authentication purposes and user name to display during the game. Authentication is performed by a magic link.

Detailed description of each page:

1. Welcome

2. Login
   - logo in the middle
   - simple input field under to enter email

3. Signup
   - logo in the middle
   - user name
   - email

4. Verify your email
   - logo in the middle
   - Verify your email address
   - text field to enter 6 digit code
   - Verify button
   - Resend code button

5. Join a group
   - plus sign in top right corner to create a new game
   - Join a game header
   - input field to enter 6 digit group code

6. Create a group
   - input field for the name of the group
   - generate code button that displayes a randomly generated 6 digit code that can be used as the identifier of the group (primary key in database!)

7. Design your character
   - Display current character
     (-- tentative --)
   - selector: race
   - selector: class
   - selector: gender

8. Play view
   - health bar
   - character
   - two buttons in one row at the bottom: act and roll

9. Dice view (popup from bottom)
   - 6 possible dice

10. Action view (popup from bottom)
    - fight button
    - hide button
    - heal button
