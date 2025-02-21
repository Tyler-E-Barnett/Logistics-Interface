A project with a collection of applications geared toward showcasing logistical data, scheduling, maintenenace and asset assignment.

Uses MASAL for Microsoft sign in

Pages and their functions:

Timecard
Shows a gantt like timeline of users currently punched in.  The cards on the left show more specific information.  On hover the punch in locations are shown
![image](https://github.com/user-attachments/assets/445d8d70-93d7-4256-bc42-1a4676c0932f)

Run Staffing
A clean UI showcasing Crew availabity for the work week.  gives a lot of information at a glance. The circles around their picture fill and change color as they approach 40 hours.
Upon hovering,  the card expands showing shift data for each day and then specific time ranges when hovering over the shifts.  
![Crew_Schedule_Hover_2_HQ](https://github.com/user-attachments/assets/69f2536d-e0e2-41fd-86f6-21f63ffef6ac)

Users can search for a specific day and it will show scheduling for the relative work week
![Crew_Schedule_Search_HQ](https://github.com/user-attachments/assets/833722a3-f286-42d6-bd50-285ec033df4c)

Logistics
Visualizes Truck Scheduling data.  The Blue bar represnents the Total Schedule length while each smaller square represents different operations within the schedule.
Yellow Blocks represent the Job Locations/Length that these schedules are based around.
![Operation_Logistics](https://github.com/user-attachments/assets/02d72605-0121-4b69-8004-179b78bd3f0a)

Item Assignment
UI for Assigning Assets to a Contract.  
A date range is selected which shows the drop down of upcoming Jobs.
A Job is then selected.
Users can then search throgh Item codes and check their availiabilty.
Users can then Assign These Item codes to the job along with quanity and pricing.
Genereic Item codes break into generic sub item codes which resole to actual euqipment items.
The gannt like view shown durin gassignment shows the actual equipment on the left.
The blue vertical bar represents the window of the current job.
Red horizonal lines represent items assigned for different jobs, you can see when these items overlap the job window.
Items for the current job are shown in blue.
![Item_Assignment_1](https://github.com/user-attachments/assets/99f0e687-8db1-4326-af6b-e01cd342668a)
![Item_Assignment_2](https://github.com/user-attachments/assets/5d2879e2-eeaf-41ac-b7a5-de2bacf05f05)

Item Code Entry
Form for enterying Item code information and assigning sub items.
seperate sub item code form is where associantion is made between sub item codes and actual intenvory items

Upload
a system to upload images as blobs to azure to then generate a link to be associated with an equipment item.


