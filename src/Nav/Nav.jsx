import './Nav.module.css';

function Nav(){
    return(
     

        <nav id="navMain">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
        <div className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" id="nav-create-tab" data-bs-toggle="dropdown" aria-expanded="false" type="button" role="tab">
                Create
            </button>
            <ul className="dropdown-menu" >
                <li><a className="dropdown-item" href="#">Own Post</a></li>
                <li><a className="dropdown-item" href="#">Random Post</a></li>
            </ul>
        </div>
          <button className="nav-link" id="nav-Read-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" >Read</button>
          <button className="nav-link" id="nav-Update-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" >Update</button>
          <button className="nav-link" id="nav-Delete-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" >Delete</button>
        </div>
      </nav>

    
    );
}

export default Nav;