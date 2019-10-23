/*global console*/
/* eslint no-console: "off" */
//

 const budgetController  = (()=>{
       
     class Item{
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value
        }
                 
    };
     
     class Expense extends Item{
        constructor(id, description, value){
            super(id, description, value);
            this.percentage = -1
        }
         
         calcPercentages (totalIncome){
            totalIncome > 0 ?
            this.percentage = Math.round((this.value / totalIncome) * 100) :
            this.percentage = -1;
                 
        }
         getPercentages () { return this.percentage }
        
     }
                            
    class Income extends Item{
        constructor(id, description, value){
            super(id, description, value)
        }
     }
     
     
     
         
     // Define data structure
     const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
     };
     
     console.log(data.totals.exp)
     
    const caculateTotal = (type) =>{
        let sum = 0;
         
            data.allItems[type].forEach(el => sum += el.value)
         
            data.totals[type] = sum;
            }
    
    
//    return{
//        addItem: (data) => {
//            const newItem = new Item( data.description, data.value);
//            console.log(newItem);
//        },
     
    return{
        addItem: (type, desc, val) => {
            let newItem, ID, perc;
            
            const newItemType = data.allItems[type];
            
            //Create new ID
            newItemType.length > 0 ? ID = newItemType[newItemType.length - 1].id + 1 : ID = 0;
            
           

            //Create new Item based on 'inc' or 'exp' type
            type === 'exp' ? newItem = new Expense( ID, desc, val) : 
            type === 'inc' ?  newItem = new Income( ID, desc, val) : 
            null;
        
            //Push new item to data structure
            
//            data.allItems[exp/inc].push 
            newItemType.push(newItem);
            
            //Return new element
            console.log(newItemType)
            return newItem;
        },
        
//         deleteItem: (type, id) =>{
//            let ids, index;
//            
//            ids = data.allItems[type].map(current => {
//                return current.id;
//            });
//            
//            index = ids.indexOf(id);
//           
//            if(index !== -1){
//                data.allItems[type].splice(index,1);
//            }
//        },
        
        
        deleteItem: (type, id) => {
            let itemIndex;
            
            //Find item index by item id
            itemIndex = data.allItems[type].findIndex( el => el.id === id );
            
            //Remove item from array based on its index
            itemIndex !== -1 ? data.allItems[type].splice(itemIndex, 1) : null;
           
        },
        
        testing: () =>{
            return data
        },
        
        
        calculateBudget: ()=>{
    
            
            //Calculate total income and expeneses
             caculateTotal('exp');
             caculateTotal('inc');
            
            
            // Calculate the Budget inc - exp
            
            data.budget = data.totals.inc - data.totals.exp;
       
            
            // calculate the percentage of income
            
            data.totals.inc > 0 ? 
                  data.percentage = (data.totals.exp / data.totals.inc) * 100 :

                data.percentage = -1;
            
                 
        },
        
        // calculate the induvidual exp percentage of income
        
        calculatePercentages: () =>{
            
            data.allItems.exp.forEach(el => el.calcPercentages(data.totals.inc));
            
        },
        
        getPercentages: () => {
            
            const allPercentages = data.allItems.exp.map(el => {
                return el.getPercentages()
            });   
            return allPercentages;
        },
        
        // Return budget
        
        getBudget : () => {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                totalBudget:data.budget,
                percentage: data.percentage,
                expPercentage: data.expPercentage
            }
        },
        
//        
       
//        calculateTotal: ()=>{
//            const total = data.totals['inc'] - data.totals['exp'];
//            
//            return total;
//        }
        
        
    } 
    

})();

    

const UIController = (()=>{
    
    const DomStrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        inputButton: '.add__btn',
        totalInc: '.budget__income--value',
        totalExp: '.budget__expenses--value',
        budgetLabel: '.budget__value',
        totalExpPerc: '.budget__expenses--percentage',
        itemExpPerc: '.item__percentage',
        container: '.container',
        dateLabel: '.budget__title--month'
    };
    
    const formatNumber = (num, type) => {
            let numSplit, int, dec;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+')+` ${int}.${dec}`;
        };
    
     const nodeListForEach = (list, callback) => {
            for(let i = 0; i < list.length; i ++){
                callback(list[i], i);
            }
        
        };

 
    return{
        getInput: () => {
            return{
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value),
                
            }
        },
        
        
        getDOMstrings: () => {
            return DomStrings;
        },
        clearFields : () => {
//         let inputFields = document.querySelector('.add__container').querySelectorAll('input');
        let inputFields = document.querySelectorAll(`${DomStrings.inputDescription}, ${DomStrings.inputValue}`);
        
            
            inputFields.forEach(el => el.value = '');
            
            inputFields[0].focus();
        
            

        },
        
        addItem: (type, item) => {
        
        const itemValue = formatNumber(item.value, type)
            
        type === 'inc' ?    
        
        document.querySelector(DomStrings.incomeList).insertAdjacentHTML('afterend', 
                `<div class="item clearfix" id="inc-${item.id}">
                    <div class="item__description">${item.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${itemValue}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>` ) : 
        
        type === 'exp' ? 
       
        document.querySelector(DomStrings.expensesList).insertAdjacentHTML('afterend', 
                `<div class="item clearfix" id="exp-${item.id}">
                    <div class="item__description">${item.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${itemValue}</div>
                        <div class="item__percentage">0</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`) :
        
        null;
                
        },
        changedType: () =>{
            let fields;
            
            fields = document.querySelectorAll(`${DomStrings.inputType}, ${DomStrings.inputDescription}, ${DomStrings.inputValue} `);
            
             nodeListForEach(fields, (current) => {
                current.classList.toggle('red-focus');
                 
            document.querySelector(DomStrings.inputButton).classList.toggle('red')
            })
            
        },
        
        deleteItem: (selectorID) => {
        
        const listItem =  document.getElementById(selectorID);
        listItem.parentNode.removeChild(listItem);
                   
        },
        

        displayBudget: (budget) => {
            let type;
            
            budget.totalBudget > 0 ? type = 'inc' : 
             budget.totalBudget < 0 ?
            type = 'exp' :
            null;
            
            document.querySelector(DomStrings.totalExp).textContent = formatNumber(budget.totalExp,'exp');
            document.querySelector(DomStrings.totalInc).textContent = formatNumber(budget.totalInc,'inc');
            document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(budget.totalBudget, type);
           
            budget.percentage > 0 ? 
            document.querySelector(DomStrings.totalExpPerc).textContent = Math.round(budget.percentage) + '%' :
            document.querySelector(DomStrings.totalExpPerc).textContent = '---';
            
        },
        displayPercentages: (percentages) => {
            let fields; 
            
             fields = document.querySelectorAll(DomStrings.itemExpPerc);
            
       
            nodeListForEach(fields, (current, index) => {
                    percentages[index] > 0 ? current.textContent = percentages[index] + '%' :
                    current.textContent = '---';
            })
        },
        
        displayMonth: ()=>{
            let now, year, month, months;
             now = new Date();
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Descember'];
             month = now.getMonth();
             year = now.getFullYear()
            
            document.querySelector(DomStrings.dateLabel).textContent = `${months[month]} ${year}`
        }
      
    
    }

})();


const controller = ((budgetCtrl, UICtrl) => {
    
    const setupEventListeners = () =>{
        
        const DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keydown', (e) => e.keyCode === 13 || e.which === 13 ? ctrlAddItem() : null );
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }
    
    
    const updateBudget = () => {
        let budget, percent;
           // 1. Calculate the budget
         
          budgetCtrl.calculateBudget()

        
        // 2. Return Budget & Percentages
            
            budget = budgetCtrl.getBudget();
        
        // 3. Display in the UI
            
        UICtrl.displayBudget(budget);
        
    
    }
    
    const updatePercentages = () => {
        
        // 1. Calculate the percentages
            budgetCtrl.calculatePercentages();
        // 2. Return Budget & Percentages
        const percentages = budgetCtrl.getPercentages();
        // 3. Display in the UI
        UICtrl.displayPercentages(percentages);
    }
    
    const ctrlAddItem = () => {
        
        let input, newItem;
    
        // 1. Get input
            
             input = UICtrl.getInput();
     
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
        // 2. Add item to the budgetCtrl
        
             newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        
                
        
        // 3. Add item to the UICtrl
        
            UICtrl.addItem(input.type, newItem)
        
        // 4. Clear Input Fields
        
           UICtrl.clearFields();
        
        // 5. calculate and update budget
        
            updateBudget();
            
        // 6. calculate and update percentages  
            updatePercentages();
    
        }
        
        
    };
    
    const ctrlDeleteItem = (event) => {
        let itemID, splitID, type, ID; 
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
    
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1])
        
        
        //1. Delete item from data structure
        
            budgetCtrl.deleteItem(type, ID)
        
        //2. Delete item from UI 
        
            UICtrl.deleteItem(itemID)
        
        //3. Recalculate and show budget
        
            updateBudget();
        
        //4. Show Percentages
            updatePercentages();
        }
        
    } 
 
   
    return {
        init: () => {
         UICtrl.displayMonth();
         UICtrl.displayBudget({
            totalInc: 0,
            totalExp: 0,
            totalBudget: 0,
            percentage: -1
         });
        setupEventListeners()
            
        }
        
    }
    
})(budgetController, UIController);

controller.init();
