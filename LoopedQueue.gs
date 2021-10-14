//Looped queue is a queue which enqueues the element as soon as it gets dequeued. This makes the queue never loose a member, when we dequeue it, it goes to the end of the queue once again.
class Queue {

  constructor() { 
      this.items = []; 
  } 
  
  front() { 
    return this.items[0]; 
  } 
  
  peek(i) {
    i = i % this.items.length;
    return this.items[i];
  }
  
  enqueue(element) {     
    this.items.push(element); 
  } 

  dequeue() {
    this.enqueue(this.front());
    return this.items.shift(); 
  }
  
  isEmpty() {
    return this.items.length == 0; 
  }
  
  clear() {
    this.items = [];
  }
  
  size() {
    return this.items.length;
  }
}