// import { useState } from 'react'
import { Box, Card, CardContent, Typography, CardMedia } from '@mui/material'


export default function BoardTemplateCreator() {
  // const [selectedTemplate, setSelectedTemplate] = useState(null)
  // const [projectName, setProjectName] = useState('')
  // const [visibility, setVisibility] = useState('private')

  return (
    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }}>
      <Typography variant='h4'>Chọn mẫu bảng</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, pt: 2 }}>
        <Card sx={{ maxWidth: 320 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://i.pinimg.com/736x/e6/b9/c1/e6b9c1decfae8e63c78edf62d1328f3f.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Việc nhà
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Một mẫu bảng việc nhà giúp bạn quản lý công việc hàng ngày của mình một cách hiệu quả.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ maxWidth: 320 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://i.pinimg.com/736x/ee/0c/5b/ee0c5bbe5c188bbec78e972c79c3a26a.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Học tập
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Một bảng phân công, phân chia công việc học tập cho các thành viên trong nhóm.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ maxWidth: 320 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://i.pinimg.com/474x/1f/14/ff/1f14ff9d10edecac0d86fe0a2fd7ed13.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Quản lý dự án
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sử dụng cấu trúc này để xây dựng quy trình làm việc lý tưởng cho nhóm của bạn, bao gồm cả các dự án nhỏ.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ maxWidth: 320 }}>
          <CardMedia
            component="img"
            height="140"
            image="https://i.pinimg.com/736x/7e/e4/86/7ee486600d5a7467a3a7eab1c8748d88.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Xây dựng sổ tay nhân viên
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Với mẫu này, bạn có thể tạo một sổ tay nhân viên cho công ty của mình.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
