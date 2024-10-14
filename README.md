## Libraries
All the libraries suggested [here](https://gist.github.com/lithdew/1c162c714bf80c857682d95c14f01d50#requirements) plus added a few for the API integration, mock database, and authentication flow:
- axios
- argon2
- uiid
- cookie
- js-cookie

## Installation
Assuming that the computer already has `node` and `npm` installed, do the following:
```js
- git clone git@github.com:christianesperar/Only1.Task.git
- cd Only1.Task
- npm install --global yarn
- yarn install
- yarn run dev
```

## Testing
- All test accounts (eg: `test@test.com`) can be found on `app/db/users.json` and the real value of all the passwords that were encrypted by Argon2 are `test1234`
- Not all scopes are covered due to time restrictions. Features covered are the following:
  - User authentication
  - Viewing of given and received invites
  - Invite users
  - Delete users

## Caveat
- For `enums`, used `label` (e.g.: `Read Posts`, etc.) rather than `key` (e.g.: `readPosts`, etc.) just to save time.
- Encountered lots of issues with the React Aria components styling that wasted some development efforts. For example, for the `screenshot below`, if you select any user in the `ComboBox`, the checkbox will always appear in the first item. Thought it had something to do with the React state or form, but ended up having an issue with the sample style where the position relative is missing.
<img width="276" alt="image" src="https://github.com/user-attachments/assets/82c20561-37a0-4af3-8619-55ead35a0434">
<br />
<img width="478" alt="Screenshot 2024-10-13 at 3 01 23 PM" src="https://github.com/user-attachments/assets/aea3ce06-9a96-46fe-a580-6ebe47dabca5">

## Demo
https://github.com/user-attachments/assets/1660e503-2f23-4ef5-968e-ce8291272bc5

