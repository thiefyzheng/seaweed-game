import React, { useState, useContext } from 'react';
import { Customer, CustomerOrder } from '@/lib/customers';
import { GameStateContext } from '@/components/SeaweedFarmer';
import { SEAWEED_TYPES } from '@/lib/utils';
import { getGrowthStage } from '@/lib/growthStages';

interface CustomerOrdersProps {
  customers: Customer[];
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ customers: initialCustomers }) => {
  const [currentCustomers, setCurrentCustomers] = useState<Customer[]>(initialCustomers);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, customerId: number) => {
    e.preventDefault();
    const seaweedId = e.dataTransfer.getData('seaweedId');
    const gameState = useContext(GameStateContext);

    if (!gameState?.gameState) {
      setErrorMessage('Game state not available!');
      return;
    }

    const seaweed = gameState.gameState.seaweeds.find(s => s.id === parseInt(seaweedId));
    if (!seaweed) {
      setErrorMessage('Invalid seaweed!');
      return;
    }

    const customer = currentCustomers.find(c => c.id === customerId);
    if (!customer) {
      setErrorMessage('Customer not found!');
      return;
    }

    const pendingOrder = customer.orders.find(o => o.status === 'pending');
    if (!pendingOrder) {
      setErrorMessage('No pending orders!');
      return;
    }

    const growthStage = getGrowthStage(seaweed.age);
    if (!growthStage || (growthStage.name !== 'Mature' && growthStage.name !== 'Optimal')) {
      setErrorMessage('Seaweed not mature enough!');
      return;
    }

    if (SEAWEED_TYPES[seaweed.type].name !== pendingOrder.seaweedType) {
      setErrorMessage(`Wrong type! Needs ${pendingOrder.seaweedType}`);
      return;
    }

    // Update customer order
    setCurrentCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedOrders = c.orders.map(o => {
          if (o === pendingOrder) {
            return { ...o, quantity: o.quantity - 1, status: o.quantity - 1 <= 0 ? 'completed' : 'pending' };
          }
          return o;
        });
        return { ...c, orders: updatedOrders };
      }
      return c;
    }));

    // Remove seaweed from game state
    gameState.setGameState(prev => ({
      ...prev,
      seaweeds: prev.seaweeds.filter(s => s.id !== parseInt(seaweedId))
    }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Malaysian Customer Orders</h2>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {currentCustomers.map(customer => (
        <div 
          key={customer.id}
          className="p-4 border rounded bg-gray-50"
          onDrop={(e) => handleDrop(e, customer.id)}
          onDragOver={handleDragOver}
        >
          <h3 className="font-semibold">{customer.name} - {customer.location}</h3>
          <p className="text-sm text-gray-600 mb-2">"{customer.dialogue}"</p>
          <div className="grid gap-2">
            {customer.orders.map((order, index) => (
              <div key={index} className={`p-2 rounded ${order.status === 'completed' ? 'bg-green-100' : 'bg-white'}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{order.localName} ({order.seaweedType})</span>
                  <span>Qty: {order.quantity}</span>
                </div>
                <div className="text-sm">
                  <p>Purpose: {order.malaysianPurpose}</p>
                  <p>Quality Required: {order.requiredQuality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
