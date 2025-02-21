# Logistics Management Dashboard

A collection of applications designed to streamline **logistical data visualization, scheduling, maintenance, and asset assignment**. This system integrates with **Microsoft Authentication using MASAL** to facilitate secure sign-in.

## Features & Applications

### **Timecard**

A Gantt-like timeline displaying users currently punched in.

- The cards on the left provide additional details.
- Hovering over a user's timeline reveals their **punch-in locations**.

<img width="1931" alt="Screenshot 2024-10-29 at 2 34 06 PM" src="https://github.com/user-attachments/assets/f63d04fe-1b26-4af9-b9b8-b77c82fa0833" />


---

### **Run Staffing**

A clean UI displaying crew availability for the workweek, offering **quick insights** into employee workload.

- Profile circles **fill and change color** as employees approach 40 hours.
- Hovering over a crew member expands the card to reveal **daily shift data**.
- Further hovering over shifts displays **specific time ranges**.

#### **Search Functionality:**

- Users can search for a specific date, and the interface updates to display the relevant workweek.
  
![Crew_Schedule_Hover_2_HQ](https://github.com/user-attachments/assets/af6e602d-dd86-41bc-ad35-f5bb5fcede87)
![Crew_Schedule_Search_HQ](https://github.com/user-attachments/assets/e55883a5-1de0-423f-aa99-cc7bd5f7fb73)

---

### **Logistics**

A visual representation of **truck scheduling data**.

- **Blue bars** represent total schedule duration.
- **Smaller squares** indicate operations within a schedule.
- **Yellow blocks** represent job locations and timeframes.

![Operation_Logistics](https://github.com/user-attachments/assets/e45a0453-03b2-4df2-b9d8-878ec721dba4)


---

### **Item Assignment**

A UI for assigning assets to contracts, with real-time availability tracking.

1. **Select a date range** to display upcoming jobs.
2. **Choose a job** from the dropdown.
3. **Search for item codes** and check availability.
4. **Assign items** to the job, specifying quantity and pricing.
5. **Hierarchy Handling:**
   - **Generic item codes** decompose into **sub-item codes**.
   - **Sub-item codes** map to actual equipment.
6. **Gantt View:**
   - The left panel displays **actual equipment items**.
   - **Blue vertical bars** indicate the current job's timeframe.
   - **Red horizontal lines** show item assignments for other jobs, highlighting conflicts.
   - **Blue assignments** represent items assigned to the current job.

![Item_Assignment_1](https://github.com/user-attachments/assets/adaac852-92e9-496d-b264-6167fada3971)

![Item_Assignment_2](https://github.com/user-attachments/assets/f65b3551-fffe-452c-b756-d357e67712de)


---

### **Item Code Entry**

A form for entering **item code details and associating sub-items**.

- A **separate sub-item entry form** allows linking sub-item codes with actual inventory.

---

### **Upload System**

A tool for uploading images as **blobs to Azure**, generating links for **association with equipment items**.

---

## **Technology Stack**

- **Authentication:** Microsoft MASAL
- **Storage:** Azure Blob Storage
- **Scheduling & Visualization:** Gantt-based interfaces
- **Asset Management:** Real-time tracking of availability and conflicts

---

## **Getting Started**

To set up this project locally:

```sh
# Clone the repository
git clone https://github.com/your-repo/logistics-dashboard.git
cd logistics-dashboard

# Install dependencies
yarn install  # or npm install

# Start the development server
yarn start  # or npm start
```

---

## **Contributing**

Pull requests are welcome! Please ensure your code follows project guidelines and includes appropriate documentation.

---

## **License**

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

