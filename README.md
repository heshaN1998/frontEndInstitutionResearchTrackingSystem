Project Structure_
	components  :          
		auth      :{Login, Register, ProtectedRoute}
		layout    :{Navbar, Footer}
		projects  :{Project components}
		milestones:{Milestone components}
		documents :{Document components}
		common    :{Shared components} 
        
	context   :{AuthContext}
         
	services  :{API service calls}
        
	types     :{TypeScript type definitions}
            
	utils     :{Utility functions}  
           
	App.tsx{Main App}         
	index.tsx{Entry point}        

Main Features_ 

 JWT Authentication (LoginRegister)
 Role-based Access Control (ADMIN, PI, MEMBER, VIEWER)
 Project Management (CRUD operations)
 Milestone Tracking
 Document Management
 Responsive UI with Bootstrap
 Protected Routes
 RESTful API Integration
