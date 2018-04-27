const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const todos=[{
  _id:new ObjectID(),
  text:"1st text"
},
{
  _id:new ObjectID(),
  text:'2nd text'
}]
beforeEach((done) => {
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos).then(()=>done())
  })
    
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not create new Todo with invalid body data',(done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        
        done();
      }).catch((e) => done(e));
    });
  })
  
});
describe('GET /todos', () => {
  it('should return A list of Todo', (done) => {
    

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos[0].text).toBe(todos[0].text);
      })
      .end((done));
  });
  
  
});
describe('GET /todos/:id', () => {
  it('should return a single Todo', (done) => {
    
    var id=todos[1]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
  
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return 404 if id not found', (done) => {
    
    var id=new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end((done));
  });
  it('should return 404 if id is invalid', (done) => {
    
    
    request(app)
      .get(`/todos/22312asfsa`)
      .expect(404)
      .end((done));
  });
  
  
});
describe('DELETE /todos/:id', () => {
  it('should Delete a single Todo', (done) => {
    
    var id=todos[1]._id.toHexString();
    
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
  
        Todo.find({_id:id}).then((todos) => {
          expect(todos.length).toBe(0);
          
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return 404 if id not found', (done) => {
    
    var id=new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end((done));
  });
  it('should return 404 if id is invalid', (done) => {
    
    
    request(app)
      .get(`/todos/22312asfsa`)
      .expect(404)
      .end((done));
  });
  
  
});

describe('PATCH /todos/:id', () => {
  it('should Update a single Todo and set completedAt', (done) => {
    
    var id=todos[1]._id.toHexString();
    var text="Updated Text";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed:true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        //expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done)
  });
  it('should Update a single Todo and clear completedAt', (done) => {
    
    var id=todos[1]._id.toHexString();
    var text="Updated Text";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed:false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done)
  });
  
  it('should return 404 if id not found', (done) => {
    
    var id=new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .expect(404)
      .end((done));
  });
  it('should return 404 if id is invalid', (done) => {
    
    
    request(app)
      .patch(`/todos/22312asfsa`)
      .expect(404)
      .end((done));
  });
  
  
});