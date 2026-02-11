# List of bugs found

## Theme selector in admin page

See screenshot : bugs\screen-bug\001-theme-selector-admin-page.png

Brolen and ugly

## Track settings

See screenshot : bugs\screen-bug\002-track-settings-section-admin-page.png

- can't set unactive before creating
- kind of ugly


## New track page does not allow attaching the track file (sound wav or mp3) to the track element

There is not elemetn or section to actually load the sound file, when creating a new file


## Admin can't save new track or theme

See screenshot : bugs\screen-bug\003-cannot-create-theme-or-track-admin-page.png

message in web browser console : Unable to add filesystem: <illegal path>Unable to add filesystem: <illegal path>

messsage in server logs:
 GET /admin/themes/new 200 in 1308ms
 ⨯ Error: Unauthorized
    at requireAdmin (src/actions/theme-actions.ts:13:11)
    at async createTheme (src/actions/theme-actions.ts:62:3)
  11 |   const session = await auth();
  12 |   if (!session?.user) {
> 13 |     throw new Error("Unauthorized");
     |           ^
  14 |   }
  15 |   return session.user;
  16 | } {
  digest: '3338290324'

  ## Content Admin page return 404