import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(list))
  } else {
    return []
  }
}
function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show:false, msg: '', type: ''})
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true,'danger','please enter value')
    } else if(name && isEditing){
      setList(
        list.map(item => {
          if (item.id === editID) {
            return {...item, title: name}
          }
          return item;
        })
      )
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    }

    else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem]);
      setName('')
    }
    
  }

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show,type,msg})
  }

  const clearList = () => {
    setList([]);
    showAlert(true, 'danger', 'empty list');
  };

  const removeItem = (id) => {
    let newList = list.filter( item => item.id !== id)
    setList(newList) 
    showAlert(true, 'danger', 'item removed')
  }

  const editItem = id => {
    const specificItem = list.find(item => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])
  
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}></Alert>}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="e.g. eggs" value={name} onChange={e => {
            setName(e.target.value)
          }}/>
          <button className="submit-btn" type="submit">{isEditing ? 'edit':'submit'}</button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem}></List>
          <button className="clear-btn" onClick={clearList}>clear items</button>
        </div>) }
    </section>
  )
}

export default App
