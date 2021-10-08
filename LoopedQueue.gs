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
  
  //This is a looped queue which always enqueues the dequeued value ~~is this even needed? 8/11/2020
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