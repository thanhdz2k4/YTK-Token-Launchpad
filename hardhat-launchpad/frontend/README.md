# 🚀 YTK Token Launchpad - Frontend Integration

## 📋 Mô tả
Frontend web application kết nối với smart contracts Launchpad sử dụng:
- **Bootstrap 5** - UI Framework
- **Ethers.js** - Blockchain interaction
- **MetaMask** - Wallet connection

## 🏗️ Cấu trúc Frontend

```
frontend/
├── index.html          # Main HTML file
├── app.js             # JavaScript logic
├── package.json       # Dependencies
└── README.md         # This file
```

## 🎯 Tính năng

### ✅ Wallet Integration
- Connect/Disconnect MetaMask
- Display user address và balances
- Auto-detect network changes

### ✅ Launchpad Features
- Real-time sale progress tracking
- Countdown timer cho sale start
- Token purchase với ETH
- Transaction history display

### ✅ Smart Contract Interaction
- Read contract state (totalRaised, hardCap, etc.)
- Write functions (buyTokens)
- Event listening (TokensPurchased)
- Error handling và user feedback

## 🚀 Cách chạy

### Bước 1: Start Local Blockchain
```bash
npx hardhat node
```

### Bước 2: Deploy Contracts
```bash
npx hardhat run scripts/deploy-lauchpad.js --network localhost
```

### Bước 3: Start Frontend Server
```bash
cd frontend
npm install
npx http-server . -p 3000 -c-1
```

### Bước 4: Cấu hình MetaMask
1. Add Hardhat Network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import test account:
   - Copy private key từ Hardhat node output
   - Import vào MetaMask

### Bước 5: Access Application
- Frontend: http://localhost:3000
- Blockchain: http://localhost:8545

## 🎮 Cách sử dụng

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Wallet status sẽ hiển thị green

### 2. Buy Tokens
- Nhập ETH amount
- Tự động tính YTK amount (rate: 1 ETH = 1000 YTK)
- Click "Buy Tokens"
- Confirm transaction trong MetaMask

### 3. Monitor Progress
- Real-time progress bar
- Sale status (Upcoming/Active/Ended)
- Your balances và contributions

### 4. View Transactions
- Recent purchases hiển thị trong bảng
- Transaction hash và details

## 📊 Contract Addresses

Update trong `app.js`:
```javascript
const LAUNCHPAD_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

## 🛠️ Customization

### Thay đổi Theme
Sửa CSS variables trong `index.html`:
```css
.gradient-bg {
    background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

### Thêm Features
- Multiple token support
- Staking functionality
- Governance voting
- NFT integration

## ⚠️ Lưu ý

### Security
- Chỉ sử dụng với testnet/localhost
- Không deploy lên mainnet without audit
- Validate tất cả user inputs

### Performance
- Optimize for mobile devices
- Implement loading states
- Handle network latency

### Error Handling
- MetaMask not installed
- Network mismatch
- Transaction failures
- Contract errors

## 🐛 Troubleshooting

### MetaMask Issues
```
Error: MetaMask not detected
Solution: Install MetaMask browser extension
```

### Network Issues
```
Error: Wrong network
Solution: Switch to Hardhat network (Chain ID: 31337)
```

### Transaction Failures
```
Error: Hard cap reached
Solution: Sale đã đạt giới hạn tối đa
```

### Contract Connection
```
Error: Contract not found
Solution: Kiểm tra contract addresses trong app.js
```

## 📱 Mobile Responsive

Frontend được thiết kế responsive cho:
- Desktop (>= 1200px)
- Tablet (768px - 1199px)
- Mobile (<= 767px)

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Advanced charting
- [ ] Social features
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Admin panel

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console for errors
2. Verify MetaMask connection
3. Ensure correct network selection
4. Check contract addresses

Built with ❤️ using Hardhat & Bootstrap
