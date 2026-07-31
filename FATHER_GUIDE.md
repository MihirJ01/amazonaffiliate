# Simple guide: managing MG Studio & Sales

This guide explains how to open the website and change Amazon product links. You do not need to know coding.

## Website address

The public website is:

```text
https://mgstudios.vercel.app/
```

Anyone can open this link and browse the products.

## Open the admin area

Use a computer or phone browser (Chrome, Edge, Safari, etc.).

1. Open the browser.
2. Click the address bar at the top.
3. Type or copy this full address:

   ```text
   https://mgstudios.vercel.app/control-room
   ```

4. Press **Enter** or **Go**.
5. You will see a page called **Control room**.
6. In the Passcode box, enter:

   ```text
   admin-demo
   ```

7. Click **Unlock admin**.

> Keep the admin address and passcode private. Do not post them on social media or send them to people who should not edit the site.

## Change an Amazon product link

After opening the admin area, scroll down to **Supabase link manager**.

1. Click the first box and choose the product you want to update.
2. Open Amazon in another browser tab.
3. Find the correct product.
4. Copy your Amazon Associates affiliate link. It should include your affiliate tag.
5. Return to the Control room tab.
6. Paste the link into the long link box.
7. Click **Save link**.
8. Wait for the message: **Affiliate link saved to Supabase.**

The public website will use the saved link for that product.

## Check that the link works

1. Open the public website: `https://mgstudios.vercel.app/`.
2. Find the product you changed.
3. Click **View on Amazon**.
4. Confirm that the correct Amazon page opens.

If the wrong page opens, return to the Control room and save the correct affiliate link again.

## Important notes

- The website does **not** sell products itself. It sends visitors to Amazon.
- Use only your own Amazon Associates links.
- Do not change a link unless you have checked that the product is correct.
- The product name, image, price, and description are currently managed by the developer. The admin page currently changes the Amazon affiliate link only.
- If you see a message saying that Supabase is not configured, contact the developer. The website needs its Supabase settings added in Vercel before links can be saved.

## If something goes wrong

| Problem                    | What to do                                                  |
| -------------------------- | ----------------------------------------------------------- |
| The website does not open  | Check your internet connection, then try the address again. |
| The passcode does not work | Type `admin-demo` carefully with no spaces.                 |
| A link does not save       | Check that the full link starts with `https://`.            |
| The Amazon page is wrong   | Save the correct Amazon Associates link for that product.   |
| You see a Supabase error   | Take a screenshot and send it to the developer.             |

## Quick reminder

Public website:

```text
https://mgstudios.vercel.app/
```

Admin page:

```text
https://mgstudios.vercel.app/control-room
```

Admin passcode:

```text
admin-demo
```
