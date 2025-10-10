# CBTL Frontend Layout Setup

### Note:
1. **Frontend for server folder** refers to the frontend interface we created to display dynamic text via a web URL.
2. **Verion 4 xtravu DSS app install** app download directly from repo.

---

## Steps

1. **Create Layouts**
   - In the `cbtl` folder, create two separate layouts:
     - `Menu Board Layout`
     - `Happy Birthday Layout`

2. **Add Trigger Code**
   - Add trigger code:  
     ```text
     HBL_gk2
     ```
     for the `Happy Birthday Layout`.

3. **Use Layout in Trigger Action**
   - Use the `HBL_gk2` layout in the trigger action (navigate to layout).
   - Add a new trigger code in the action webhook trigger:
     ```text
     trigger_dynamic_content_gk2
     ```

4. **Update Display Description**
   - Add the same trigger code in the display description:
     ```text
     trigger_dynamic_content_gk2
     ```

5. **Assign Menu Board Layout**
   - Assign the `Menu Board Layout` to the display and description that have the trigger code:
     ```text
     trigger_dynamic_content_gk2
     ```

---

