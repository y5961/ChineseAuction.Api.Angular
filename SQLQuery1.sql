
select  * 
from Users

select *
from Gifts

UPDATE Users
SET IsManager = 1
WHERE Email = 'Ss456456@gmail.com';
SELECT 
    O.IdUser,
    O.IdOrder,
    G.IdGift,
    G.Name AS GiftName,
    G.price AS UnitPrice,
    OrdersGift.Amount,
    (G.price * OrdersGift.Amount) AS TotalItemPrice
FROM OrdersOrders O
JOIN OrdersGift  ON O.IdOrder = OrdersGift.IdOrder
JOIN [Gifts] G ON OrdersGift.IdGift = G.IdGift
WHERE O.[Status] = 0 
ORDER BY O.IdUser;

